import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { getClient } from "../../../controllers/clientController";
import { getAllProfessionals } from "../../../controllers/professionalController";
import ProfessionalSchedule from "./professional-schedule/professional-schedule";
import ClientSchedule from "./client-schedule/client-schedule";

import './style.css'
import { LoadingScreen } from "../../../components/loading/loading-screen/loading-screen";

const professionalCache = require('../../../cache/professionalCache.json')
const clientCache = require('../../../cache/clientCache.json')

export default function ScheduleCheck() {
    const [loading, setLoading] = useState(true);
    const [professional, setProfessional] = useState<string | null>(null)


    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login');

            await getClient(user.uid)
            if (!clientCache[user.uid]) return navigate('/login');

            await getAllProfessionals()

            const professionals = Object.keys(professionalCache)
            professionals.map(profId => {
                if (professionalCache[profId].email === user.email) setProfessional(profId)
            })
            setLoading(false);
        })
    }, [navigate])


    if (loading) return <LoadingScreen />
    return professional !== null ?
        <ProfessionalSchedule profId={professional} /> :
        <ClientSchedule />


}


