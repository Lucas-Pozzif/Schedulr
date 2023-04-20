import { serviceType } from "../../../controllers/serviceController";
import { TabButton } from "../../buttons/tab-button/tab-button";
import { Dispatch, SetStateAction } from "react"

type stateTabType = {
    service: serviceType,
    setState: Dispatch<SetStateAction<number>>
}
function StateTab({ service, setState }: stateTabType) {
    return service.haveStates ? (
        <div className="stateTab">
            {service.stateNames.map((stateName, index) => (
                <TabButton
                    key={index}
                    title={stateName}
                    onClickButton={() => setState(index)}
                />
            ))}
        </div>
    ) : null;
}
export default StateTab