import socket
import sys
import json
from datetime import datetime

buffer_size = 326582
host = "0.0.0.0"
port = 5555
print('5')
while True:

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(30.0)
    # sock.setblocking(0)
    sock.bind((host, port))
    sock.listen()
    conn, addr = sock.accept()
    data = conn.recv(buffer_size).decode('ascii')    
    data = data.split("\n")
    print("data", data[0])

