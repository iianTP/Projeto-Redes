import socket, threading
from process_controller import ProcessController

h = open('index.html', 'r')
homepage = h.read()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print(s)
print(hex(id(s)))

s.bind(('', 8080))
# '' = binds to all interfaces
# Binding to port 0 --> bind to a OS-assigned random port
s.listen(5)

pc = ProcessController()

while not pc.exit:
	ws, addr = s.accept()
	print('newsock', ws)
	print('add', addr)
	pc.Process(ws,addr)

	# t = threading.Thread(target=process_request, args=(ws, addr))
	# t.start()

ws.close()
s.close()

# sudo fuser -i -k 8080/tcp
# roda Wireshark (loopback:lo), roda Server, roda browser (127.0.0.1:8080), compara com index.htm
