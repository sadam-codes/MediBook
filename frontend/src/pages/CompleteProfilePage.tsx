import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from '../components/PatientForm';

export const CompleteProfilePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 overflow-y-auto pb-12">
            <PatientForm onComplete={() => navigate('/home')} />
        </div>
    );
};
