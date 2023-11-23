import { Dispatch, SetStateAction, useState } from "react";
import { Service, SubService } from "../../Classes/service";
import { User } from "../../Classes/user";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { ServiceForm } from "../service-form/service-form";
import { Line } from "../../Components/line/line";
import { SmallButton } from "../../Components/buttons/small-button/small-button";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { ItemButton } from "../../Components/buttons/item-button/item-button";

import "./sub-service-form.css";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { HeaderInput } from "../../Components/inputs/header-input/header-input";
import { IconInput } from "../../Components/inputs/icon-input/icon-input";

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

  const arrow = require("../../Assets/arrow.png");
  const bin = require("../../Assets/delete.png");
  const money = require("../../Assets/money.png");

  const timeArray: string[] = [];

  timeArray.push(`0:10`, `0:20`, `0:30`, `0:40`, `0:50`);
  for (let i = 1; i <= 11; i++) {
    timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
  }
  timeArray.push(`12:00`);
  const duration = [...sServiceForm.getDuration()];

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className='sub-service-form'>
      <HeaderInput
        placeholder={"Digite o nome do Subserviço"}
        value={sServiceForm.getName()}
        icon={bin}
        onChange={(e) => {
          sServiceForm.setName(e.target.value);
          const updatedSService = new SubService(sServiceForm);
          setSServiceForm(updatedSService);
        }}
        onClickReturn={onClickReturn}
        onClickIcon={() => {
          alert("ainda não implementado");
        }}
      />
      <div className='ssf-data-block'>
        <IconInput
          placeholder={"Digite o Valor"}
          value={sServiceForm.getValue()}
          onChange={(e) => {
            sServiceForm.setValue(e.target.value);
            const updatedSService = new SubService(sServiceForm);
            setSServiceForm(updatedSService);
          }}
          icon={bin}
        />
        <Line />
        <div className='ssf-bottom-columns'>
          <div className='ssf-left-column'>
            <SmallButton
              title={"A partir de"}
              selected={sServiceForm.getInicial()}
              onClick={() => {
                sServiceForm.setInicial(!sServiceForm.getInicial());
                const updatedSService = new SubService(sServiceForm);
                setSServiceForm(updatedSService);
              }}
            />
          </div>
          <div className='ssf-right-column'>
            <SubHeader
              title={`${Math.floor(duration.length / 6)}h ${(duration.length % 6) * 10}m`}
              buttonTitle={"Remover espaços"}
              onClick={() => {
                const duration = sServiceForm.getDuration();
                duration.map((value, index) => {
                  duration[index] = true;
                });
                sServiceForm.setDuration(duration);
                const updatedSService = new SubService(sServiceForm);
                setSServiceForm(updatedSService);
              }}
            />
            <div className='sf-item-list'>
              {timeArray.map((timeValue, index) => {
                return (
                  <ItemButton
                    title={timeValue}
                    subtitle={""}
                    selected={sServiceForm.getDuration()?.[index]}
                    onClick={() => {
                      if (index >= duration.length) {
                        const diff = index - duration.length + 1;
                        duration.push(...Array(diff).fill(false));
                      }
                      duration[index] = !duration[index];
                      let lastIndex = duration.length - 1;
                      while (lastIndex >= 0 && !duration[lastIndex]) {
                        duration.pop();
                        lastIndex--;
                      }
                      sServiceForm.setDuration(duration);
                      const updatedSService = new SubService(sServiceForm);
                      setSServiceForm(updatedSService);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomButton
        hidden={!sServiceForm.isValid()}
        title={"Salvar Subserviço"}
        onClick={() => {
          const subServices = [...serviceForm.getSubServices(), sServiceForm];
          serviceForm.setSubServices(subServices);
          const updatedService = new Service(serviceForm);
          setServiceForm(updatedService);
          onClickReturn();
        }}
      />
    </div>
  );
}
