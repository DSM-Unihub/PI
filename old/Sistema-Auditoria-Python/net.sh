#!/bin/bash

# Dar Permissao ao access.log
sudo chmod o+r /var/log/squid/access.log

# Dar Permissao ao Bloqueados.txt
sudo chmod 777 /etc/squid/files/bloqueados.txt 


# Configuraçao do NAT e DROP sem Proxy da Rede
sudo modprobe iptable_nat

echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE

sudo iptables -A FORWARD -j DROP
