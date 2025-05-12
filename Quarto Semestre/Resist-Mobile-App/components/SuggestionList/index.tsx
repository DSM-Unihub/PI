import { FlatList, Image, ImageBackground, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { s } from "./style";
import Header from "../Header";
import { useNavigation } from "expo-router";
import axios from "axios";

interface Suggestion {
    id: string;
    dataHora: string;
    url: string;
    situacao: boolean;
}

interface SuggestionListProps {
    navigation: any; // ou o tipo correto para o seu caso
    userId: string;
}

export default function SuggestionList({ userId }: SuggestionListProps) {
    const navigation = useNavigation();
    const [data, setData] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://192.168.0.109:4000/api/user/sugestoes/${userId}`);
                setData(response.data);
            } catch (err) {
                setError('Erro ao carregar os dados');
                console.log(err + `http://192.168.0.109:4000/api/user/sugestoes/${userId}`)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Retorna a data formatada
    };

    if (loading) {
        return <Text>Carregando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={s.container}>
            <View style={s.table}>
                <View style={s.headerRow}>
                    <ImageBackground source={require('@/assets/images/background.png')}>
                    </ImageBackground>
                    <Text style={s.headerCell}>Data</Text>
                    <Text style={s.headerCell}>URL do site</Text>
                    <Text style={s.headerCell}>Situação</Text>
                </View>
                <FlatList
                    data={data}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={s.row}
                            onPress={() => navigation.navigate('Details', { suggestion: item })}
                        >
                            <Text style={s.cell}>{formatDate(item.dataHora)}</Text>
                            <Text style={s.cell}>{item.url}</Text>
                            <Text style={s.cell}>{item.situacao ? "bloqueado" : "desbloqueado"}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}