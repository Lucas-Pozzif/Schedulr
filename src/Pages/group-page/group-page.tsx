import { useEffect, useState, useRef } from "react";
import { Group } from "../../Classes/group";
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button";
import { Line } from "../../Components/line/line";
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { User } from "../../Classes/user";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import { useParams } from "react-router-dom";
import { Header } from "../../Components/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { Service } from "../../Classes/service";
import { Carousel } from "../../Components/carousel/carousel";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";
import { Professional } from "../../Classes/professional";

import "./group-page.css";

export function GroupPage() {
    const [user, setUser] = useState(new User());
    const [group, setGroup] = useState(new Group());
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedTime, setSelectedTime] = useState<number | null>(null)
    const [selectedWeekDay, setSelectedWeekDay] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [tab, setTab] = useState(0);

    const { groupId } = useParams();

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, async (client) => {
            if (!client) return; //There is no user on the firebase authentication
            await user.getUser(client.uid);
            setUser(new User(user));
        });
        group.getGroup(groupId || "").then(async () => {
            await group.updateServices()
            await group.updateProfessionals()
            setGroup(new Group(group));
            setLoading(false);
        });
    }, []);

    const star = require("../../Assets/star.png");

    const days: any[][] = [];

    function capitalize(word: string): string {
        return word
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');
    }
    for (let i = 0; i < 9; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        days.push([])
        switch (i) {
            case 0:
                days[i].push("Hoje")
                break;
            case 1:
                days[i].push("Amanhã")
                break;
            default:
                days[i].push(capitalize(day.toLocaleString("pt-BR", { weekday: "long" })))
                break;
        }
        days[i].push(day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }))
        days[i].push(day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }))
        days[i].push(day.getDay())
    }

    var ratingSum = 5;
    group.getRatings().map((rating) => {
        ratingSum += rating.rate;
    });
    const averageRating = (ratingSum / (group.getRatings.length + 1)).toFixed(2);

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className='group-page'>
                        <img className='gp-banner' src={group.getBanner()} />
                        <div className='gp-title-block'>
                            <p className='gp-title'>{group.getTitle()}</p>
                            <p className='gp-type'>
                                {group.getType()} - {"$".repeat(group.getPricing())}
                            </p>
                        </div>
                        <div className='gp-header'>
                            <div className='gp-block'>
                                <div className='gp-rating-block'>
                                    <img className='gp-rating-icon' src={star} />
                                    <p className='gp-rating'>
                                        {averageRating} ({group.getRatings().length})
                                    </p>
                                </div>
                                <p className='gp-comment'>Comentários ({group.getRatings().length})</p>
                            </div>
                            <p className='gp-distance'>{group.getLocation()}</p>
                            <Line />
                        </div>

                        <div className='gp-bottom-columns'>
                            <div className='gp-left-column'>
                                <DropdownButton
                                    title={days[selectedDay][0]}
                                    dropDownItems={days.map((day, index) => {
                                        return [day[0], () => {
                                            setSelectedDay(index)
                                            setSelectedWeekDay(day[3])
                                        }];
                                    })}
                                />
                            </div>
                            <div className='gp-right-column'>
                                <LinkButton
                                    title='Horário e Serviço'
                                    onClick={() => {
                                        setTab(1);
                                    }}
                                />
                                <LinkButton
                                    title='Profissional'
                                    onClick={() => {
                                        setTab(2);
                                    }}
                                />
                                <div className='gp-image-group'>
                                    {group.getImages().map((image) => {
                                        return <img className='gf-image' src={image} />;
                                    })}
                                </div>
                            </div>
                        </div>
                        <BottomPopup title='' subtitle='' buttonTitle='' onClick={async () => { }} isActive={false} />
                    </div>
                );
            case 1:
                const timeArray = [];
                const startHour = Math.floor(group.getStartHours()[selectedWeekDay] / 2)
                const endHour = Math.floor(group.getHours()[selectedWeekDay]?.length / 2)

                const tempTime: string[] = []

                for (let i = 0; i < 24; i++) {
                    tempTime.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);

                }

                for (let i = startHour; i - startHour < endHour; i++) {
                    if (i >= 0) {
                        timeArray.push(`${i}:00`, `${i}:10`, `${i}:20`, `${i}:30`, `${i}:40`, `${i}:50`);
                    }
                }

                return (
                    <div className='gp-service-tab'>
                        <Header
                            title={"Escolha o horário"}
                            icon={""}
                            onClickReturn={() => {
                                setTab(0);
                            }}
                            onClickIcon={() => { }}
                        />
                        <SubHeader
                            title={selectedService?.getName() || ""}
                            buttonTitle={"Alterar Serviço"}
                            onClick={() => {
                                setTab(3);
                            }}
                        />
                        <div className="carousel">
                            {
                                days.map((day, index) => {
                                    return (
                                        <div className={"carousel-item" + (index === selectedDay ? " selected" : "")} onClick={() => {
                                            setSelectedDay(index)
                                            setSelectedWeekDay(day[3])
                                        }}>
                                            <p className="carousel-item-text" >{day[0]}</p>
                                            <p className="carousel-item-text"  >{day[1]}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='gp-list'>
                            {timeArray.map((time, index) => {
                                return (
                                    <div
                                        className="gp-time-row"
                                        onClick={() => {
                                            setSelectedTime(index + (startHour * 6))
                                            console.log(selectedService?.getDuration())

                                        }}
                                    >
                                        <div className={"gp-time-button" + (index + (startHour * 6) === selectedTime ? " selected" : "")} >
                                            <p className="gpt-title">{days[selectedWeekDay][0]}</p>
                                            <p className="gpt-title">{time}</p>
                                        </div>
                                        <div className="gpt-row-item">
                                            <ItemButton
                                                title={selectedService?.getName() || "Serviço não selecionado"}
                                                subtitle={"Ainda não implementado"}
                                                isSelected={index + (startHour * 6) === selectedTime}
                                                onClick={() => { }}
                                            />
                                        </div>


                                    </div>
                                );
                            })}
                        </div>
                        <BottomButton hide={selectedService !== null} title={"Escolher Horário"} />
                    </div>
                );
            case 2:
                return (
                    <div className="gp-professional-tab">
                        <Header
                            title={"Escolha o serviço"}
                            icon={""}
                            onClickReturn={() => {
                                if (selectedService !== null) {
                                    setTab(1);
                                } else {
                                    setTab(0);
                                }
                            }}
                            onClickIcon={() => { }}
                        />
                        <div className='gp-list'>
                            {group.getProfessionals().map((professional) => {
                                return (
                                    <ItemButton
                                        title={professional.getName()}
                                        subtitle={professional.getOccupations().join(', ')}
                                        isSelected={professional.getId() === selectedProfessional?.getId()}
                                        onClick={() => {
                                            if (selectedProfessional?.getId() === professional.getId()) {
                                                setSelectedProfessional(null)
                                            } else {
                                                setSelectedProfessional(professional);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className='gp-service-tab'>
                        <Header
                            title={"Escolha o serviço"}
                            icon={""}
                            onClickReturn={() => {
                                if (selectedService !== null) {
                                    setTab(1);
                                } else {
                                    setTab(0);
                                }
                            }}
                            onClickIcon={() => { }}
                        />
                        <div className="carousel">
                            {
                                days.map((day, index) => {
                                    return (
                                        <div className={"carousel-item" + (index === selectedDay ? " selected" : "")} onClick={() => {
                                            setSelectedDay(index)
                                            setSelectedWeekDay(day[3])
                                        }}>
                                            <p className="carousel-item-text" >{day[0]}</p>
                                            <p className="carousel-item-text" >{day[1]}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='gp-list'>
                            {group.getServices().map((service) => {
                                return (
                                    <ItemButton
                                        title={service.getName()}
                                        subtitle={"Ainda não implementado"}
                                        isSelected={group.getId() === selectedService?.getId()}
                                        onClick={() => {
                                            if (selectedService?.getId() === service.getId()) {
                                                setSelectedService(null)
                                            } else {
                                                setSelectedService(service);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <BottomButton hide={selectedService == null} title={"Escolher Horário"} onClick={() => {
                            setTab(1)
                        }} />
                    </div>
                );
            default:
                return <div />;
        }
    };

    return loading ? <LoadingScreen /> : tabHandler();
}
