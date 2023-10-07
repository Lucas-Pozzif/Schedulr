import { Dispatch, SetStateAction, useState } from "react";
import { Group } from "../../Classes/group"
import { User } from "../../Classes/user"
import { Professional } from "../../Classes/professional";
import { LoadingScreen } from "../../Components/loading/loading-screen/loading-screen";
import { Line } from "../../Components/line/line";
import { SmallButton } from "../../Components/buttons/small-button/small-button";
import { LinkButton } from "../../Components/buttons/link-button/link-button";

type professionalFormType = {
    user?: User
    groupForm: Group
    setGroupForm: Dispatch<SetStateAction<Group>>
    professional?: Professional
    onClickReturn?: () => void
}

export function ProfessionalForm({ user, groupForm, setGroupForm, professional = new Professional(), onClickReturn }: professionalFormType) {
    const [loading, setLoading] = useState(false);
    const [professionalForm, setProfessionalForm] = useState(professional);
    const [tab, setTab] = useState(0)
    //const [selectedSService, setSelectedSService] = useState<null | number>(null)

    const arrow = require("../../Assets/arrow.png");
    const more = require("../../Assets/more.png");
    const bin = require("../../Assets/delete.png");
    const mail = require("../../Assets/mail.png");
    const addImage = require("../../Assets/add-image.png");
    const addUser = require("../../Assets/add-user.png");

    const tabHandler = () => {
        switch (tab) {
            case 0:
                return (
                    <div className="service-form">
                        <div className="sf-header">
                            <img className="return-button" src={arrow} onClick={onClickReturn} />
                            <div className="sf-header-text-block">
                                <input className="sf-header-title" placeholder="Nome do Profissonal" value={professionalForm.getName()} onChange={(e) => {
                                    professionalForm.setName(e.target.value);
                                    const updatedProfessional = new Professional(professionalForm);
                                    setProfessionalForm(updatedProfessional);
                                }} />
                                <p className="sf-header-subtitle">aasdfas</p>
                            </div>
                            <img className="sf-delete-button" src={bin} onClick={() => { alert("ainda não implementado") }} />
                        </div>
                        <div className="sf-data-block">
                            <div className="sf-value-block">
                                <img className="sf-value-icon" src={mail} />
                                <input className="sf-value-input" placeholder="Digitar email" value={professionalForm.getEmail()} onChange={(e) => {
                                    professionalForm.setEmail(e.target.value);
                                    const updatedProfessional = new Professional(professionalForm);
                                    setProfessionalForm(updatedProfessional);
                                }} />
                            </div>
                            <Line />
                            <div className="sf-bottom-columns">
                                <div className="sf-left-column">
                                    <SmallButton
                                        title={"Admin"}
                                        isSelected={professionalForm.getIsAdmin()}
                                        onClick={() => {
                                            professionalForm.setIsAdmin(!professionalForm.getIsAdmin())
                                            const updatedProfessional = new Professional(professionalForm)
                                            setProfessionalForm(updatedProfessional)
                                        }}
                                    />
                                </div>
                                <div className="sf-right-column">
                                    <LinkButton
                                        title={"Alterar Serviços"}
                                        onClick={
                                            () => { setTab(1) }
                                        }
                                    />
                                    <LinkButton
                                        title={"Alterar Horários"}
                                        onClick={
                                            () => { setTab(2) }
                                        }
                                    />
                                    <LinkButton
                                        title={"Alterar Ocupações"}
                                        onClick={
                                            () => { setTab(3) }
                                        }
                                    />
                                    <div className="sf-image-group">
                                        <div className="sf-image-add">
                                            <img className="sf-image-add-icon" src={addImage} />
                                        </div>
                                        {professionalForm.getImages().map((image) => { return (<img className="gf-image" src={image} />) })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return <div />
        }
    }

    return loading ?
        <LoadingScreen /> :
        tabHandler()
}