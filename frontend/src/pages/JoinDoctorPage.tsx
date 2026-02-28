import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorStepper } from '../components/DoctorStepper';

export const JoinDoctorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 overflow-y-auto pb-12">
            <DoctorStepper onComplete={() => {
                navigate('/home');
                window.location.reload();
            }} />
        </div>
    );
};
