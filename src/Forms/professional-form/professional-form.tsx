import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Group } from "../../Classes/group";
import { User } from "../../Classes/user";
import { Professional } from "../../Classes/professional";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { SmallButton } from "../../Components/buttons/small-button/small-button";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { Header } from "../../Components/header/header";
import { Service } from "../../Classes/service";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import { ServiceForm } from "../service-form/service-form";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { Carousel } from "../../Components/carousel/carousel";

type professionalFormType = {
  user?: User;
  groupForm: Group;
  setGroupForm: Dispatch<SetStateAction<Group>>;
  professional?: Professional;
  onClickReturn: () => void;
};

export function ProfessionalForm({ user, groupForm, setGroupForm, professional = new Professional(), onClickReturn }: professionalFormType) {
  const [loading, setLoading] = useState(false);
  const [professionalForm, setProfessionalForm] = useState(professional);
  const [tab, setTab] = useState(0);
  const [selectedOcupation, setSelectedOcupation] = useState<null | number>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  const fullDays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

  const arrow = require("../../Assets/arrow.png");
  const more = require("../../Assets/more.png");
  const bin = require("../../Assets/delete.png");
  const mail = require("../../Assets/mail.png");
  const addImage = require("../../Assets/add-image.png");
  const block = require("../../Assets/block.png");

  useEffect(() => {
    setLoading(true);
    if (professional.getId() === "") {
      professional.setStartHours(groupForm.getStartHours());
      professional.setShift(groupForm.getHours());
    }
    setLoading(false);
  }, []);

  const tabHandler = () => {
    function formatArray(arr: string[]) {
      const length = arr.length;

      return length === 0 ? "Não há ocupações" : length === 1 ? arr[0] : length === 2 ? `${arr[0]} & ${arr[1]}` : `${arr[0]}, ${arr[1]} & ${length - 2} mais`;
    }
    if (professional.getId() !== "") {
    }
    switch (tab) {
      case 0:
        return (
          <div className='service-form'>
            <div className='sf-header'>
              <img className='return-button' src={arrow} onClick={onClickReturn} />
              <div className='sf-header-text-block'>
                <input
                  className='sf-header-title'
                  placeholder='Nome do Profissonal'
                  value={professionalForm.getName()}
                  onChange={(e) => {
                    professionalForm.setName(e.target.value);
                    const updatedProfessional = new Professional(professionalForm);
                    setProfessionalForm(updatedProfessional);
                  }}
                />
                <p className='sf-header-subtitle'>{formatArray(professionalForm.getOccupations())}</p>
              </div>
              <img
                className='sf-delete-button'
                src={bin}
                onClick={() => {
                  alert("ainda não implementado");
                }}
              />
            </div>
            <div className='sf-data-block'>
              <div className='sf-value-block'>
                <img className='sf-value-icon' src={mail} />
                <input
                  className='sf-value-input'
                  placeholder='Digitar email'
                  value={professionalForm.getEmail()}
                  onChange={(e) => {
                    professionalForm.setEmail(e.target.value);
                    const updatedProfessional = new Professional(professionalForm);
                    setProfessionalForm(updatedProfessional);
                  }}
                />
              </div>
              <Line />
              <div className='sf-bottom-columns'>
                <div className='sf-left-column'>
                  <SmallButton
                    title={"Admin"}
                    isSelected={professionalForm.getIsAdmin()}
                    onClick={() => {
                      professionalForm.setIsAdmin(!professionalForm.getIsAdmin());
                      const updatedProfessional = new Professional(professionalForm);
                      setProfessionalForm(updatedProfessional);
                    }}
                  />
                </div>
                <div className='sf-right-column'>
                  <LinkButton
                    title={"Alterar Serviços"}
                    onClick={() => {
                      setTab(1);
                    }}
                  />
                  <LinkButton
                    title={"Alterar Horários"}
                    onClick={() => {
                      setTab(2);
                    }}
                  />
                  <LinkButton
                    title={"Alterar Ocupações"}
                    onClick={() => {
                      setTab(3);
                    }}
                  />
                  {/*
                  <div className='sf-image-group'>
                    <div className='sf-image-add'>
                      <img className='sf-image-add-icon' src={addImage} />
                    </div>
                    {professionalForm.getImages().map((image) => {
                      return <img className='gf-image' src={image} />;
                    })}
                  </div>
                    */}
                </div>
              </div>
            </div>
            <BottomPopup
              title={"Editando..."}
              subtitle={`Profissional de ${groupForm.getTitle()}`}
              buttonTitle={"Salvar"}
              onClick={async () => {
                setLoading(true);
                if (professionalForm.getId()) {
                  await professionalForm.setProfessional();
                  const idIndex = groupForm.getProfessionalsIds().indexOf(professionalForm.getId());
                  const professional = groupForm.getProfessionals();
                  professional[idIndex] = professionalForm;
                } else {
                  await professionalForm.addProfessional();
                  groupForm.setProfessionalsIds([...groupForm.getProfessionalsIds(), professionalForm.getId()]);
                  groupForm.setProfessionals([...groupForm.getProfessionals(), professionalForm]);
                }
                setGroupForm(new Group(groupForm));
                setLoading(false);
                onClickReturn();
              }}
              isActive={professionalForm.isValid()}
            />
          </div>
        );
      case 1:
        return (
          <div className='gf-tab'>
            <Header
              title='Editar Serviços'
              icon={more}
              onClickReturn={() => {
                setTab(0);
              }}
              onClickIcon={() => {
                setTab(4);
              }}
            />
            <div className='gf-list'>
              {groupForm
                .getServices()
                .sort((a, b) => a.getName().localeCompare(b.getName()))
                .map((service: Service, index: number) => {
                  return (
                    <ItemButton
                      title={service.getName()}
                      subtitle={service.getDurationValue()}
                      isSelected={professionalForm.getServices().includes(service.getId())}
                      onClick={() => {
                        const services = [...professionalForm.getServices()];
                        if (professionalForm.getServices().includes(service.getId())) {
                          const index = services.indexOf(service.getId());
                          services.splice(index, 1);
                        } else {
                          services.push(service.getId());
                        }
                        professionalForm.setServices(services);
                        setProfessionalForm(new Professional(professionalForm));
                      }}
                    />
                  );
                })}
            </div>
          </div>
        );
      case 2:
        const timeArray = [];

        for (let i = 0; i <= 24; i++) {
          timeArray.push(`${i}:00`, `${i}:30`);
        }
        return (
          <div className='gf-tab'>
            <Header
              title='Alterar Horários'
              icon={block}
              onClickIcon={() => {
                const startHours = [...professionalForm.getStartHours()];
                const hours = [...professionalForm.getShift()];

                startHours[selectedDay] = 0;
                hours[selectedDay] = [];

                professionalForm.setShift(hours);
                professionalForm.setStartHours(startHours);
                setProfessionalForm(new Professional(professionalForm));
              }}
              onClickReturn={() => {
                setTab(0);
              }}
            />
            <SubHeader
              title={fullDays[selectedDay]}
              buttonTitle='Preencher horários'
              onClick={() => {
                const hours = [...professionalForm.getShift()];
                hours[selectedDay] = hours[selectedDay]?.map(() => true);

                professionalForm.setShift(hours);
                setProfessionalForm(new Professional(professionalForm));
              }}
            />
            <Carousel
              items={fullDays.map((day, index) => {
                return {
                  title: day,
                  isSelected: selectedDay == index,
                  onClick: () => {
                    setSelectedDay(index);
                  },
                };
              })}
            />
            <div className='gf-list'>
              {timeArray.map((timeValue, index) => {
                const startHour = [...professionalForm.getStartHours()];
                const hours = [...professionalForm.getShift()];
                const selected = professionalForm.getShift()[selectedDay]?.[index - professionalForm.getStartHours()[selectedDay]];

                return (
                  <ItemButton
                    title={timeValue}
                    subtitle={""}
                    isSelected={selected}
                    onClick={() => {
                      if (!startHour[selectedDay]) {
                        startHour[selectedDay] = 0;
                      }
                      startHour[selectedDay] = parseInt(startHour[selectedDay].toString());

                      if (isNaN(startHour[selectedDay])) {
                        startHour[selectedDay] = 0;
                      }

                      if (startHour[selectedDay] > 0) {
                        const falseValuesToAdd = Array(startHour[selectedDay]).fill(false);
                        hours[selectedDay] = [...falseValuesToAdd, ...hours[selectedDay]];
                        startHour[selectedDay] = 0;
                      }
                      if (!hours[selectedDay]) {
                        hours[selectedDay] = [];
                      }

                      if (index >= hours[selectedDay].length) {
                        const diff = index - hours[selectedDay].length + 1;
                        hours[selectedDay].push(...Array(diff).fill(false));
                      }
                      hours[selectedDay][index] = !hours[selectedDay][index];
                      let lastIndex = hours[selectedDay].length - 1;
                      while (lastIndex >= 0 && !hours[selectedDay][lastIndex]) {
                        hours[selectedDay].pop();
                        lastIndex--;
                      }
                      startHour[selectedDay] = hours[selectedDay].indexOf(true);
                      for (let i = 0; i < startHour[selectedDay]; i++) {
                        hours[selectedDay].shift();
                      }
                      professionalForm.setShift(hours);
                      professionalForm.setStartHours(startHour);
                      setProfessionalForm(new Professional(professionalForm));
                      console.log(professionalForm);
                    }}
                  />
                );
              })}
            </div>
            <BottomButton
              hide={false}
              title={"Confirmar"}
              onClick={() => {
                setTab(0);
              }}
            />
          </div>
        );
      case 3:
        const occupations = [...professionalForm.getOccupations()];
        return (
          <div className='service-form'>
            <div className='ssf-header'>
              <img
                className='return-button'
                src={arrow}
                onClick={() => {
                  setTab(0);
                }}
              />
              <div className='ssf-header-text-block'>
                <input
                  className='ssf-header-title'
                  placeholder='Digite a Ocupação'
                  maxLength={25}
                  value={selectedOcupation !== null ? professionalForm.getOccupations()[selectedOcupation] : ""}
                  onChange={(e) => {
                    if (selectedOcupation === null) {
                      setSelectedOcupation(occupations.length);
                      occupations.push(e.target.value);
                    } else {
                      occupations[selectedOcupation] = e.target.value;
                    }
                    professionalForm.setOccupations(occupations);
                    setProfessionalForm(new Professional(professionalForm));
                  }}
                />
                <p className='ssf-header-subtitle'>{professionalForm.getName()}</p>
              </div>
              <img
                className='ssf-delete-button'
                src={bin}
                onClick={() => {
                  const updatedOccupations = occupations.filter((occupation, index) => index !== selectedOcupation);
                  professionalForm.setOccupations(updatedOccupations);
                  setProfessionalForm(new Professional(professionalForm));
                }}
              />
            </div>
            <SubHeader title={selectedOcupation !== null ? professionalForm.getOccupations()[selectedOcupation] : `${professionalForm.getOccupations().length} ocupações`} buttonTitle={"Nova Ocupação"} onClick={() => setSelectedOcupation(null)} />

            <div className='sf-item-list'>
              {professionalForm
                .getOccupations()
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((occupation, index) => {
                  return (
                    <ItemButton
                      title={occupation}
                      subtitle={""}
                      isSelected={index == selectedOcupation}
                      onClick={() => {
                        if (index == selectedOcupation) {
                          setSelectedOcupation(null);
                        } else {
                          setSelectedOcupation(index);
                        }
                      }}
                    />
                  );
                })}
            </div>
            <BottomButton
              hide={
                !occupations
                  .map((occupation) => {
                    return occupation.length > 0;
                  })
                  .includes(true)
              }
              title={"Salvar Ocupações"}
              onClick={() => {
                setTab(1);
              }}
            />
          </div>
        );
      case 4:
        return <ServiceForm user={user} groupForm={groupForm} setGroupForm={setGroupForm} onClickReturn={() => setTab(1)} />;
      default:
        return <div />;
    }
  };

  return loading ? <LoadingScreen /> : tabHandler();
}
