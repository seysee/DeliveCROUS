import { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import ItemCard from "../../src/components/ItemCard";
import PanierButton from "@/src/components/PanierButton";
import FavoriButton from "@/src/components/FavoriteButton";

const dishes = [
    {
        id: "1",
        name: "Pâtes Bolognaise",
        price: "10€",
        image: require("../../assets/images/spaghetti.jpg"),
        description: "Les pâtes fraîches, cuites al dente, sont servies avec une sauce bolognaise maison, mijotée pendant plusieurs heures pour concentrer toutes les saveurs. La sauce est à base de viande de bœuf hachée soigneusement dorée, de tomates fraîches et de concentré de tomates pour un goût riche et profond. Des oignons et de l'ail sautés apportent de la douceur, tandis que les carottes et le céleri ajoutent une touche de fraîcheur. Le tout est parfaitement assaisonné avec du sel, du poivre, du basilic et du thym. Une généreuse râpée de parmesan affiné couronne ce plat, apportant une touche crémeuse et salée qui se marie à merveille avec la sauce. Ce plat classique de la cuisine italienne est une explosion de saveurs réconfortantes.",
        allergens: ["Gluten", "Lait", "Œufs"]
    },
    {
        id: "2",
        name: "Salade de fruits",
        price: "8€",
        image: require("../../assets/images/fruits.jpg"),
        description: "Cette salade de fruits frais est un véritable concentré de vitamines et de fraîcheur. Elle contient un assortiment de fruits de saison soigneusement sélectionnés : des oranges juteuses, des kiwis acidulés, des fraises sucrées, des pommes croquantes et des raisins éclatants de saveur. Chaque fruit est coupé en morceaux parfaits pour un maximum de plaisir à chaque bouchée. Une légère touche de menthe fraîche est ajoutée pour intensifier les arômes fruités, et une pincée de sucre de canne est parfois ajoutée pour rehausser les saveurs naturelles des fruits. Cette salade est le choix idéal pour un dessert léger et rafraîchissant, parfait pour toutes les occasions.",
        allergens: ["Aucun"]
    },
    {
        id: "3",
        name: "Viande grillée",
        price: "12€",
        image: require("../../assets/images/meat.jpg"),
        description: "Cette viande grillée est un véritable délice pour les amateurs de grillades. La pièce de viande, soigneusement choisie pour sa tendreté, est grillée sur des braises ardentes, permettant de créer une croûte savoureuse et caramélisée tout en gardant une texture juteuse à l'intérieur. Chaque bouchée révèle des arômes fumés et grillés qui viennent compléter parfaitement la viande. Elle est accompagnée de légumes de saison, comme des courgettes, des poivrons et des oignons, eux aussi grillés à la perfection. Le tout est servi avec une sauce béarnaise maison, à base de beurre clarifié, d'estragon et d'échalotes, offrant une richesse crémeuse et légèrement acidulée qui équilibre les saveurs. Ce plat robuste est idéal pour un repas copieux et savoureux.",
        allergens: ["Aucun"]
    },
    {
        id: "4",
        name: "Maïs grillé",
        price: "7€",
        image: require("../../assets/images/corn.jpg"),
        description: "Ce maïs grillé est une spécialité simple mais pleine de saveurs. L'épi de maïs, tendre et sucré, est d'abord grillé sur des braises ou dans une poêle, ce qui lui donne une croûte légèrement caramélisée et fumée. Le maïs est ensuite généreusement badigeonné de beurre fondu, qui fond lentement et imprègne chaque grain, rendant le plat encore plus savoureux. Une touche d'épices, comme le paprika fumé et le cumin, est ajoutée pour un goût légèrement épicé, tout en préservant le goût sucré naturel du maïs. Ce plat peut être accompagné d'une sauce au yaourt nature pour une touche de fraîcheur et d'onctuosité, ce qui le rend encore plus agréable à déguster.",
        allergens: ["Lait"]
    },
    {
        id: "5",
        name: "Tarte aux pommes",
        price: "6€",
        image: require("../../assets/images/apple-pie.jpg"),
        description: "Cette tarte aux pommes est un dessert traditionnel réconfortant. La pâte sablée, à la fois légère et croquante, est réalisée à la main avec du beurre de qualité, de la farine et un soupçon de sucre pour obtenir une base douce et friable. Elle est généreusement garnie de pommes fraîches, soigneusement coupées en fines tranches pour une présentation parfaite. Les pommes sont légèrement sucrées et parfumées à la cannelle et au sucre roux, qui se caramélisent lors de la cuisson pour créer une texture fondante et un goût sucré et épicé. La tarte est cuite jusqu'à ce que la pâte soit dorée à la perfection, et peut être servie chaude avec une boule de glace à la vanille ou de la crème chantilly pour une touche de gourmandise supplémentaire.",
        allergens: ["Gluten", "Lait", "Œufs"]
    },
    {
        id: "6",
        name: "Crème brûlée",
        price: "5€",
        image: require("../../assets/images/creme-brulee.jpg"),
        description: "La crème brûlée est un dessert incontournable de la cuisine française, et cette version ne fait pas exception. Sa base crémeuse est réalisée à partir de jaunes d'œufs, de sucre, de lait et de vanille, le tout cuit lentement au bain-marie pour obtenir une texture douce et soyeuse. Une fois refroidie, elle est saupoudrée d'une couche de sucre qui est ensuite caramélisée à l'aide d'un chalumeau, créant une croûte dorée et croquante. La combinaison de la crème veloutée et de la croûte sucrée et croquante est un équilibre parfait, offrant une expérience gustative raffinée et délicieuse. La vanille utilisée, souvent de qualité supérieure, donne à ce dessert une profondeur de saveur qui en fait un délice classique et intemporel.",
        allergens: ["Lait", "Œufs"]
    },
    {
        id: "7",
        name: "Mousse au chocolat",
        price: "4€",
        image: require("../../assets/images/chocolate-mousse.jpg"),
        description: "Cette mousse au chocolat est légère et aérienne, offrant une explosion de saveurs chocolatées. Elle est préparée avec du chocolat noir de haute qualité, fondant lentement avec un peu de sucre et de beurre, avant d'être incorporée délicatement aux blancs d'œufs battus en neige pour obtenir une texture légère et mousseuse. Cette mousse est à la fois riche en chocolat et incroyablement légère, fondant sur la langue pour révéler des arômes profonds et intenses de cacao. Servie dans des ramequins individuels, elle peut être accompagnée de copeaux de chocolat ou de fruits frais pour ajouter une touche supplémentaire de fraîcheur et de contraste.",
        allergens: ["Lait", "Œufs"]
    },
    {
        id: "8",
        name: "Profiteroles",
        price: "7€",
        image: require("../../assets/images/profiteroles.jpg"),
        description: "Les profiteroles sont de petits choux garnis de crème pâtissière maison, un classique de la pâtisserie française. La pâte à choux est légère et aérée, cuite jusqu'à ce qu'elle soit dorée et croquante à l'extérieur tout en restant tendre à l'intérieur. Chaque chou est rempli d'une crème pâtissière onctueuse, préparée à partir de lait, d'œufs, de sucre et de vanille. Les profiteroles sont ensuite nappées d'un généreux coulis de chocolat chaud, riche et velouté, qui s'écoule parfaitement sur les choux. Ces bouchées sucrées et gourmandes peuvent être servies en dessert ou lors d'une occasion spéciale, et sont un délice à partager en famille ou entre amis.",
        allergens: ["Gluten", "Lait", "Œufs"]
    },
];


export default function ItemDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const item = dishes.find((dish) => dish.id === id);

    const [inCart, setInCart] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const filteredDishes = dishes.filter(dish => dish.id !== id);

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Plat introuvable</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>{item.name}</Text>

                    {/* Utilisation des composants PanierButton et FavoriButton */}
                    <PanierButton inCart={inCart} toggleInCart={() => setInCart(!inCart)} />
                    <FavoriButton isFavorited={isFavorited} toggleIsFavorited={() => setIsFavorited(!isFavorited)} />
                </View>

                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.allergenTitle}>Allergènes</Text>
                <Text style={styles.allergenList}>
                    {item.allergens.map((allergen, index) => (
                        <Text key={index}>- {allergen}{"\n"}</Text>
                    ))}
                </Text>
            </View>

            <Text style={styles.suggestedTitle}>Plats Suggérés</Text>
            <FlatList
                data={filteredDishes.slice(0, 3)}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ItemCard item={item} />}
                contentContainerStyle={styles.suggestedContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    backButton: { marginBottom: 10 },
    backText: { fontSize: 18, color: "blue" },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        objectFit: "cover",
    },
    details: { marginTop: 20 },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    name: { fontSize: 22, fontWeight: "bold", flex: 1 },

    price: { fontSize: 18, color: "red", marginVertical: 5 },
    description: { fontSize: 16, color: "#555", marginBottom: 10 },
    allergenTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    allergenList: { fontSize: 16, color: "#666" },
    errorText: { fontSize: 20, color: "red", textAlign: "center", marginTop: 50 },
    suggestedTitle: { fontSize: 20, fontWeight: "bold", marginTop: 30, marginBottom: 10 },
    suggestedContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 15,
    },
    separator: {
        width: 10,
    },
    card: {
        width: 200,
        height: 350,
        overflow: "hidden", // empêche le débordement des éléments
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
        marginRight: 15,
        padding: 10,
    },
    cardImage: {
        width: "100%",
        height: 150, // hauteur de l'image de la carte
        borderRadius: 10,
    },
    cardText: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
});