import { useFetcher, useNavigate, useParams } from 'react-router';

import { RecipeForm, getDefaultValues } from './RecipeForm';
import './Form.css';
import { useEffect, useState } from 'react';

function RecipeEditor({ user }) {
    const navigate = useNavigate();
    const { recipe_id } = useParams();
    const [values, setValues] = useState();

    if (!user) {
        navigate("/");
    }

    useEffect(() => {
        async function getRecipe() {
            // For editing recipe
            const idToken = await user.getIdToken();
            const body = {
                idToken: idToken,
            };
            
            const response = await fetch(`http://localhost:8080/recipes/${recipe_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
    
            setValues(await response.json());
        };

        if (!values) {
            if (recipe_id) {
                getRecipe();
            } else {
                setValues(getDefaultValues());
            }
        }
    });

    return values && (
        <div className="form-container">
            <RecipeForm values={values} onSuccess={(newRecipeId) => navigate(`/recipes/${newRecipeId}`)}/>
        </div>
    );
}

export default RecipeEditor;