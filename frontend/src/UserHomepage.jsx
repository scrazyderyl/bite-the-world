import React from 'react';

const UserHomepage = ({ username, recipes }) => {
  return (
    <div style={styles.container}>
      <h2>Welcome, {username}!</h2>
      <h3>Your Recipes</h3>
      {recipes.length > 0 ? (
        <ul style={styles.recipeList}>
          {recipes.map((recipe, index) => (
            <li key={index} style={styles.recipeItem}>
              {recipe}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes saved yet.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  recipeList: {
    listStyle: 'none',
    padding: 0,
  },
  recipeItem: {
    padding: '10px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    borderRadius: '5px',
  },
};

export default UserHomepage;