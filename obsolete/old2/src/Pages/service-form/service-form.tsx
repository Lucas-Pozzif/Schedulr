import { useState } from "react";
import { Service } from "../../Classes/service";
import { useNavigate } from "react-router-dom";
import { User } from "../../Classes/user";
import { ReturnButton } from "../../Components/buttons/return-button";

type serviceFormType = {
  user?: User;
  service?: Service;
};

export function ServiceForm({ user, service = new Service() }: serviceFormType) {
  const [loading, setLoading] = useState(false);
  const [serviceForm, setServiceForm] = useState(service);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (newTab: any) => {};

  return (
    <div className='service-form'>
      <div className='sf-header flex-div'>
        <ReturnButton />
        <p className='sf-header-name'>{serviceForm.getName()}</p>
        <p className='sf-header-value'>{serviceForm.getValue()}</p>
      </div>
    </div>
  );
}
