import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import "../Styles/Recipes.css";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Ingredient() {
    const [IngredientInfo, setIngedientInfo] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { Ingredient_id } = useParams();

    const fetchIngredient = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const body = {
                idToken: idToken,
            };
            console.log("Fetching Ingredient with ID:", Ingredient_id);
            const response = await fetch(`http://localhost:8080/ingredients/${Ingredient_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error("Error fetching Ingredient:", response.status);
                throw new Error("Failed to fetch Ingredient");
            }

            const result = await response.json();
            setIngedientInfo(result);
        } catch (error) {
            toast.error("Failed to view Ingredient. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false); // Set loading to false when fetch is done
        }
    };
    
    useEffect(() => {
        fetchIngredient();
    }, [Ingredient_id]); // Run fetchIngredient only when Ingredient_id 

    if (loading) {
        return <div>Loading...</div>; // Show loading message
    }
  
    return (IngredientInfo &&
        <>
              <div className="recipe-card"> 
                {/* Using same class as recipe for now or until this is needed*/}
                <h2 className="recipe-title">{IngredientInfo.name}</h2>
                <p className="recipe-description">Author: {IngredientInfo.authorId}</p>
                <img src={IngredientInfo.image} alt={IngredientInfo.name}></img>
                <p className="recipe-description">Details: {IngredientInfo.description}</p>
                


              </div>
        </>
    )
}

const styles = {
    summary: {
        fontSize: "20px",
    }
}

export default Ingredient;