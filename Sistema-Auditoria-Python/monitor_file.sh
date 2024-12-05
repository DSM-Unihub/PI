#!/bin/bash

# Caminho para o arquivo a ser monitorado
file_to_watch="/etc/squid/files/bloqueados.txt"

# Inicializa o tamanho do arquivo
if [ ! -f "$file_to_watch" ]; then
    exit 1
fi

last_size=$(stat -c%s "$file_to_watch")

while true; do
    # Usa inotifywait para monitorar modificações no arquivo
    inotifywait -e modify "$file_to_watch" > /dev/null 2>&1

    # Obtém o tamanho atual do arquivo
    new_size=$(stat -c%s "$file_to_watch")

    if [ "$new_size" -gt "$last_size" ]; then
        squid -k reconfigure
    elif [ "$new_size" -lt "$last_size" ]; then
        squid -k reconfigure
    fi

    # Atualiza o tamanho do arquivo para a próxima verificação
    last_size=$new_size
done
