import socket
import sys
import json
from datetime import datetime

buffer_size = 326582
host = "127.0.0.1"
port = 5555

while True:

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(30.0)
    # sock.setblocking(0)
    sock.connect((host, port))
    data = sock.recv(buffer_size).decode('ascii')
    
    data = data.split("\n")
    print("data", data)

