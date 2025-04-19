import { useNavigate } from 'react-router';

import { RecipeForm, getDefaultValues } from './RecipeForm';
import './Form.css';

function RecipeEditor({ user }) {
    const navigate = useNavigate();

    if (!user) {
        navigate("/");
    }

    return (
        <div className="form-container">
            <RecipeForm values={getDefaultValues()}/>
        </div>
    );
}

export default RecipeEditor;