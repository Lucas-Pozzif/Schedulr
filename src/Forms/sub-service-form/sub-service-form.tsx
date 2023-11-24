import "./sub-service-form.css";

import { Dispatch, SetStateAction, useState } from "react";

import { Service, SubService, User } from "../../Classes/classes-imports";
import { bin, longTimeArray } from "../../_global";
import { BottomButton, HeaderInput, IconInput, ItemButton, Line, LoadingScreen, SmallButton, SubHeader } from "../../Components/component-imports";
import { formatDuration } from "../../Function/functions-imports";

type subServiceFormType = {
  user?: User;
  serviceForm: Service;
  setServiceForm: Dispatch<SetStateAction<Service>>;
  subService?: SubService;
  onClickReturn: () => void;
};

export function SubServiceForm({ user, serviceForm, setServiceForm, subService = new SubService(), onClickReturn }: subServiceFormType) {
  const [loading, setLoading] = useState(false);
  const [sServiceForm, setSServiceForm] = useState(subService);

  const duration = [...sServiceForm.getDuration()];

  const saveSService = () => {
    const subServices = [...serviceForm.getSubServices()];
    const existingIndex = subServices.findIndex((sserv) => sserv.getId() === sServiceForm.getId());

    if (existingIndex !== -1) {
      subServices[existingIndex] = sServiceForm;
    } else {
      subServices.push(sServiceForm);
    }
    serviceForm.setSubServices(subServices);
    const updatedService = new Service(serviceForm);
    setServiceForm(updatedService);
    onClickReturn();
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className='sub-service-form'>
      <HeaderInput
        placeholder={"Digite o nome do Subserviço"}
        value={sServiceForm.getName()}
        icon={bin}
        onChange={(e) => sServiceForm.updateState(setSServiceForm, "name", e.target.value)}
        onClickReturn={onClickReturn}
        onClickIcon={() => alert("ainda não implementado")}
      />
      <div className='ssf-data-block'>
        <IconInput placeholder={"Digite o Valor"} value={sServiceForm.getValue()} onChange={(e) => sServiceForm.updateState(setSServiceForm, "value", e.target.value)} icon={bin} />
        <Line />
        <div className='ssf-bottom-columns'>
          <div className='ssf-left-column'>
            <SmallButton title={"A partir de"} selected={sServiceForm.getInicial()} onClick={() => sServiceForm.updateState(setSServiceForm, "inicial", !sServiceForm.getInicial())} />
          </div>
          <div className='ssf-right-column'>
            <SubHeader title={formatDuration(duration)} buttonTitle={"Remover espaços"} onClick={() => sServiceForm.fillHours(setSServiceForm)} />
            <div className='sf-item-list'>
              {longTimeArray.map((timeValue, index) => {
                return <ItemButton title={timeValue} selected={sServiceForm.getDuration()?.[index]} onClick={() => sServiceForm.updateHourList(index, setSServiceForm)} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomButton hidden={!sServiceForm.isValid()} title={"Salvar Subserviço"} onClick={saveSService} />
    </div>
  );
}
