import { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';

function Country({ country }) {
    const [countryInfo, setCountryInfo] = useState();

    useEffect(() => {
        fetch(`http://localhost:8080/country/${country.country_code}`)
          .then(res => res.json())
          .then(data => setCountryInfo(data) )
      }, []);
      
    return (countryInfo &&
        <>
            <h1>{ country.name }</h1>
            <p style={styles.summary}>{ countryInfo.country.summary }</p>
            <h2>Recipes</h2>
            <div className="recipes-container">
                { countryInfo.recipes && countryInfo.recipes.map(recipe => 
                        <RecipeCard key={recipe.id} recipe={recipe}/>
                    )
                }
            </div>
        </>
    )
}

const styles = {
    summary: {
        fontSize: "20px",
    }
}

export default Country;