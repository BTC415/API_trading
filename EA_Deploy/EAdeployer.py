import os
import shutil
import paramiko
import configparser
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import json

class EADeployer:
    def __init__(self, config_path):
        self.config = self.load_config(config_path)
        self.ssh_clients = {}
        self.setup_ssh_connections()

    def load_config(self, config_path):
        config = configparser.ConfigParser()
        config.read(config_path)
        return config

    def setup_ssh_connections(self):
        for server in self.config.sections():
            if server.startswith('Server_'):
                self.ssh_clients[server] = self.create_ssh_client(server)

    def create_ssh_client(self, server):
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(
            hostname=self.config[server]['hostname'],
            username=self.config[server]['username'],
            password=self.config[server]['password']
        )
        return ssh_client

    def deploy_ea(self, ea_path, server, platform):
        ssh_client = self.ssh_clients[server]
        remote_path = self.config[f'{server}_{platform}_Paths']['ea_folder']
        ea_name = os.path.basename(ea_path)
        remote_file_path = f"{remote_path}/{ea_name}"

        sftp = ssh_client.open_sftp()
        sftp.put(ea_path, remote_file_path)
        sftp.close()

        print(f"Deployed {ea_name} to {server} {platform} at {remote_file_path}")

    def restart_terminal(self, server, platform):
        ssh_client = self.ssh_clients[server]
        command = self.config[f'{server}_{platform}_Commands']['restart']
        stdin, stdout, stderr = ssh_client.exec_command(command)
        print(f"Restarted {server} {platform} terminal")

class EAHandler(FileSystemEventHandler):
    def __init__(self, deployer, mapping_file):
        self.deployer = deployer
        self.mapping = self.load_mapping(mapping_file)

    def load_mapping(self, mapping_file):
        with open(mapping_file, 'r') as f:
            return json.load(f)

    def on_created(self, event):
        if event.is_directory:
            return
        ea_name = os.path.basename(event.src_path)
        if ea_name in self.mapping:
            for target in self.mapping[ea_name]:
                server, platform = target.split('_')
                self.deployer.deploy_ea(event.src_path, f'Server_{server}', platform)
                self.deployer.restart_terminal(f'Server_{server}', platform)

def main():
    config_path = 'multi_config.ini'
    mapping_file = 'ea_mapping.json'
    watch_folder = 'path/to/ea/folder'

    deployer = EADeployer(config_path)
    event_handler = EAHandler(deployer, mapping_file)
    observer = Observer()
    observer.schedule(event_handler, watch_folder, recursive=False)
    observer.start()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
