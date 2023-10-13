import { useEffect, useState, useRef } from "react";
import { Group } from "../../Classes/group"
import { DropdownButton } from "../../Components/buttons/dropdown-button/dropdown-button"
import { Line } from "../../Components/line/line"
import { LinkButton } from "../../Components/buttons/link-button/link-button";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Services/firebase/firebase";
import { User } from "../../Classes/user";
import { BottomPopup } from "../../Components/buttons/bottom-popup/bottom-popup";
import { useParams } from "react-router-dom";

import "./group-page.css"
import { Header } from "../../Components/header/header";
import { SubHeader } from "../../Components/sub-header/sub-header";
import { Service } from "../../Classes/service";
import { Carousel } from "../../Components/carousel/carousel";
import { ItemButton } from "../../Components/buttons/item-button/item-button";
import { BottomButton } from "../../Components/buttons/bottom-button/bottom-button";

export function GroupPage() {
    const [user, setUser] = useState(new User())
    const [group, setGroup] = useState(new Group())
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [tab, setTab] = useState(0);

    const { groupId } = useParams()

    useEffect(() => {
        setLoading(true)
        onAuthStateChanged(auth, async (client) => {
            if (!client) return //There is no user on the firebase authentication
            await user.getUser(client.uid)
            setUser(new User(user))
        })
        group.getGroup(groupId || "").then(() => {
            setGroup(new Group(group))
            setLoading(false)
        })
    }, [])

    const star = require("../../Assets/star.png")

    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    var ratingSum = 5
    group.getRatings().map((rating) => {
        ratingSum += rating.rate
    })
    const averageRating = (ratingSum / (group.getRatings.length + 1)).toFixed(2)

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="group-page">
                        <img
                            className="gp-banner"
                            src={group.getBanner()}
                        />
                        <div className="gp-title-block">
                            <p className="gp-title">{group.getTitle()}</p>
                            <p className="gp-type">{group.getType()} - {'$'.repeat(group.getPricing())}</p>
                        </div>
                        <div className="gp-header">
                            <div className="gp-block">
                                <div className="gp-rating-block">
                                    <img className="gp-rating-icon" src={star} />
                                    <p className="gp-rating">{averageRating} ({group.getRatings().length})</p>
                                </div>
                                <p className="gp-comment">Comentários ({group.getRatings().length})</p>
                            </div>
                            <p className="gp-distance">{group.getLocation()}</p>
                            <Line />
                        </div>

                        <div className="gp-bottom-columns">
                            <div className="gp-left-column">
                                <DropdownButton
                                    title={days[selectedDay]}
                                    dropDownItems={days.map((day, index) => { return [day, () => setSelectedDay(index)] })}
                                />
                            </div>
                            <div className="gp-right-column">
                                <LinkButton title="Horário e Serviço" onClick={() => { setTab(1) }} />
                                <LinkButton title="Profissional" onClick={() => { setTab(2) }} />
                                <div className="gp-image-group">
                                    {group.getImages().map((image) => { return (<img className="gf-image" src={image} />) })}
                                </div>
                            </div>
                        </div>
                        <BottomPopup
                            title=""
                            subtitle=""
                            buttonTitle=""
                            onClick={async () => { }}
                            isActive={false}
                        />
                    </div>
                )
            case 1:
                return (
                    <div className="gp-service-tab">
                        <Header
                            title={"Escolha o horário"}
                            icon={""}
                            onClickReturn={() => {
                                setTab(0)
                            }}
                            onClickIcon={() => {

                            }}
                        />
                        <SubHeader
                            title={selectedService?.getName() || ""}
                            buttonTitle={"Alterar Serviço"}
                            onClick={() => {
                                setTab(3)
                            }}
                        />
                        <Carousel
                            items={[

                            ]}
                        />
                        <div className="gp-service-list">
                            {
                                group.getServices().map((service) => {
                                    return (
                                        <ItemButton
                                            title={service.getName()}
                                            subtitle={"Ainda não implementado"}
                                            isSelected={service.getId() === selectedService?.getId()}
                                            onClick={() => { setSelectedService(service) }}
                                        />
                                    )
                                })
                            }
                        </div>
                        <BottomButton
                            hide={selectedService !== null}
                            title={"Escolher Horário"}
                        />
                    </div>
                )
            case 2:
            case 3:
                return (
                    <div className="gp-service-tab">
                        <Header
                            title={"Escolha o serviço"}
                            icon={""}
                            onClickReturn={() => {
                                if (selectedService !== null) {
                                    setTab(1)
                                } else {
                                    setTab(0)
                                }
                            }}
                            onClickIcon={() => {

                            }}
                        />
                        <Carousel
                            items={[

                            ]}
                        />
                        <div className="gp-service-list">
                            {
                                group.getServices().map((service) => {
                                    return (
                                        <ItemButton
                                            title={service.getName()}
                                            subtitle={"Ainda não implementado"}
                                            isSelected={service.getId() === selectedService?.getId()}
                                            onClick={() => { setSelectedService(service) }}
                                        />
                                    )
                                })
                            }
                        </div>
                        <BottomButton
                            hide={selectedService !== null}
                            title={"Escolher Horário"}
                        />
                    </div>
                )
            default:
                return (
                    <div />
                )
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}