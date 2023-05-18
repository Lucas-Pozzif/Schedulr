import { useState } from "react";
import { useParams } from "react-router-dom";
import ServiceForm from "../service-form/service-form";
import { getService } from "../../../controllers/serviceController";
import { LoadingScreen } from "../../../components/loading/loading-screen/loading-screen";


export default function ServiceEdit() {
    const { serviceId } = useParams();

    const [loading, setLoading] = useState(true);
    const [serviceData, setServiceData] = useState(false);

    if (serviceId === undefined) return <p>error</p>

    getService(serviceId).then(() => {
        setServiceData(true);
        setLoading(false);
    });

    if (loading) {
        return <LoadingScreen />;
    }

    if (!serviceData) {
        return <p>Error: could not fetch service data</p>;
    }

    return <ServiceForm serviceId={parseInt(serviceId)} />;
}
