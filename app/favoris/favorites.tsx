import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import ItemCard from "../../src/components/ItemCard";

export default function Favorites() {
    const [favoris, setFavoris] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [favorisRes, itemsRes] = await Promise.all([
                    fetch("http://localhost:5000/favoris"),
                    fetch("http://localhost:5000/items"),
                ]);

                if (!favorisRes.ok || !itemsRes.ok) {
                    throw new Error("Erreur lors de la récupération des données");
                }

                const [favorisData, itemsData] = await Promise.all([
                    favorisRes.json(),
                    itemsRes.json(),
                ]);

                setFavoris(favorisData);
                setItems(itemsData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleFavorite = async (itemId) => {
        if (!itemId) {
            console.error("toggleFavorite a reçu un itemId invalide !");
            return;
        }

        const isAlreadyFavorited = favoris.some(fav => fav.itemId === itemId);

        if (isAlreadyFavorited) {
            const favoriToRemove = favoris.find(fav => fav.itemId === itemId);
            if (favoriToRemove) {
                await fetch(`http://localhost:5000/favoris/${favoriToRemove.id}`, { method: "DELETE" });
                setFavoris(favoris.filter(fav => fav.itemId !== itemId));
            }
        } else {
            const newFavori = { userId: "1", itemId: itemId, id: Date.now().toString() };
            await fetch("http://localhost:5000/favoris", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFavori),
            });
            setFavoris([...favoris, newFavori]);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View>
            <Text>Mes Favoris</Text>
            <FlatList
                data={items.filter(item => favoris.some(fav => fav.itemId === item.id.toString()))}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onFavoriteToggle={toggleFavorite}
                        isFavorited={favoris.some(fav => fav.itemId === item.id.toString())}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}


