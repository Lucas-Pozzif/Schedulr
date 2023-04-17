import { useState } from "react";
import { serviceType } from "../controllers/serviceController";
import { IconButton } from "../components/buttons/icon-button/icon-button";
import { Input } from "../components/input/input";
import { TabButton } from "../components/buttons/tab-button/tab-button";
import InputExample from "./text";

type serviceFormType = {
    service?: serviceType
}

type informationTabType = {
    name: string,
    setName: (newData: string) => void,

    states?: string[]
    setStates: (newData: string[]) => void,

    photo: string
    setPhoto: (newData: string) => void,

    haveStates: boolean
    setHaveStates: (newData: boolean) => void,

    inicial: boolean
    setInicial: (newData: boolean) => void,

    value: number
    setValue: (newData: number) => void,

    stateValues: number[]
    setStateValues: (newData: number[]) => void,

}

function InformationTab({
    name,
    setName,
    states,
    setStates,
    haveStates,
    setHaveStates,
    photo,
    setPhoto,
    inicial,
    setInicial,
    value,
    setValue,
    stateValues,
    setStateValues,
}: informationTabType) {
    const [stateTab, setStateTab] = useState(0)
    const [stateValue, setAStateValue] = useState('');
    const [index, setIndex] = useState(0);

    return (
        <>
            {
                haveStates ?
                    <div className="state-tabs">
                        <TabButton title={states![0]} onClickButton={() => setStateTab(0)} />
                        <TabButton title={states![1]} onClickButton={() => setStateTab(1)} />
                        <TabButton title={states![2]} onClickButton={() => setStateTab(2)} />
                        <TabButton title={states![3]} onClickButton={() => setStateTab(3)} />
                    </div> :
                    null
            }
            <Input value={name} label="Alterar nome do serviço" placeholder="Digite o nome do serviço" onValueChange={(e) => { setName(e.target.value) }} />
            {
                haveStates ?
                    <>
                        <p>{states?.join('s')}</p>
                        <Input
                            value={states![stateTab]}
                            label="Alterar nome do estado"
                            placeholder="Digite o nome do estado"
                            onValueChange={
                                (e) => {
                                    let newArr = [...states!];
                                    newArr[stateTab] = e.target.value
                                    setStates(newArr);
                                }
                            }
                        />
                        <Input
                            value={stateValues[stateTab].toString()}
                            label="Alterar valor do serviço"
                            placeholder="Digite o nome do serviço"
                            onValueChange={(e) => {
                                let newArr = [...stateValues!];
                                newArr[stateTab] = parseInt(e.target.value)
                                setStateValues(newArr);
                            }}
                        />
                    </>
                    :
                    <Input
                        value={value.toString()}
                        label="Alterar valor do serviço"
                        placeholder="Digite o valor do serviço"
                        onValueChange={(e) => { setName(e.target.value) }}
                    />
            }
            {

            }


        </>
    )
}
function ProfessionalsTab() {
    return (
        <p>ProfessionalsTab</p>
    )
}
function DurationTab() {
    return (
        <p>DurationTab</p>
    )
}
function DeleteTab() {
    return (
        <p>DeleteTab</p>
    )
}
function ErrorTab() {
    return (
        <p>Errortab</p>
    )
}
function ServiceForm({ service }: serviceFormType) {
    const [tab, setTab] = useState(0);

    const [name, setName] = useState(service?.name ? service!.name : 'Novo Serviço');

    const [states, setStates] = useState(service?.states ? service!.states : ['Curto', 'Médio', 'Longo', 'Extra-Longo']);

    const [photo, setPhoto] = useState(service?.photo ? service!.photo : '');

    const [inicial, setInicial] = useState(service?.inicial ? service!.inicial : false);

    const [haveStates, setHaveStates] = useState(true);

    const [value, setValue] = useState(service?.value ? service!.value : 100);

    const [stateValues, setStateValues] = useState(service?.stateValues ? service!.stateValues : [100, 101, 102, 103]);

    const [duration, setDuration] = useState(service?.duration ? service!.duration : [false]);

    const [currentPromotion, setCurrentPromotion] = useState(service?.promotion.currentPromotion ? service?.promotion.currentPromotion : null);

    const [promotedUntil, setPromotedUntil] = useState(service?.promotion.promotedUntil ? service!.promotion.promotedUntil : null);

    let updatedService: serviceType = {
        name: name,
        states: states,
        photo: photo,
        inicial: inicial,
        haveStates: haveStates,
        value: value,
        duration: duration,
        promotion: {
            currentPromotion: currentPromotion,
            promotedUntil: promotedUntil
        }
    }


    function tabHandler() {
        switch (tab) {
            case 0: console.log(updatedService.name, name)
                if (updatedService.name != name) setName(updatedService.name)
                return <InformationTab
                    name={name}
                    setName={setName}
                    states={states}
                    setStates={setStates}
                    haveStates={haveStates}
                    setHaveStates={setHaveStates}
                    photo={photo}
                    setPhoto={setPhoto}
                    inicial={inicial}
                    setInicial={setInicial}
                    value={value}
                    setValue={setValue}
                    stateValues={stateValues}
                    setStateValues={setStateValues}
                />
            case 1:
                return <ProfessionalsTab />
            case 2:
                return <DurationTab />
            case 3:
                return <DeleteTab />
            default:
                return <ErrorTab />
        }
    }
    return (
        <>
            <div className="service-button">
                <div className="return-button"></div>
                <p className="service-name">{name}</p>
                <img src={photo}></img>
            </div>
            <div className="tabs">
                <IconButton darkMode={tab == 0} title="Informações Individuais" icon="a" onClickButton={() => { setTab(0) }} />
                <IconButton darkMode={tab == 1} title="Alterar Profissionais" icon="a" onClickButton={() => { setTab(1) }} />
                <IconButton darkMode={tab == 2} title="Tempo de Duração" icon="a" onClickButton={() => { setTab(2) }} />
                <IconButton darkMode={tab == 3} title="Excluir Serviço" icon="a" onClickButton={() => { setTab(3) }} />
            </div>
            {tabHandler()}
            <InputExample options={states} />
        </>
    )

}

export { ServiceForm }