import { useState, useEffect, ChangeEvent, useRef } from 'react'

import { Input } from "../../../../components/input/input";
import updateProfessional from "../../../../functions/updaters/update-professional";
import { professionalTabType } from "../professional-form";
import { addOccupation, getAllOccupations, occupationType } from '../../../../controllers/occupationController';
import { DetailButton } from '../../../../components/buttons/detail-button/detail-button';
import { SmallButton } from '../../../../components/buttons/small-button/small-button';
import { VerticalLine } from '../../../../components/line/vertical-line';
import { IconButton2 } from '../../../../components/buttons/icon-button-2/icon-button-2';

import './style.css'
import { LoadingScreen } from '../../../../components/loading/loading-screen/loading-screen';

const occupationCache = require('../../../../cache/occupationCache.json')

export function InformationTab({ professional, setProfessional }: professionalTabType) {
    const [occupationIds, setOccupationIds] = useState<string[] | null>(null)
    const [occupation, setOccupation] = useState<occupationType>({ name: '' })
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const reader = new FileReader();

        reader.onload = () => {
            setProfessional({
                ...professional,
                photo: reader.result as string
            })
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        getAllOccupations().then(() => {
            setOccupationIds(Object.keys(occupationCache));
        });
    }, []);

    if(selectedImage !== null){
    }

    return (
        <div className='p-form-information-tab'>
            <Input
                label="Alterar nome do profissional"
                value={professional.name}
                onValueChange={(e) => updateProfessional(professional, setProfessional, 'name', e.target.value)}
                placeholder="Digite o nome do serviço"
            />
            <Input
                label="Alterar email do profissional"
                value={professional.email}
                onValueChange={(e) => updateProfessional(professional, setProfessional, 'email', e.target.value)}
                placeholder="exemplo@email.com"
            />

            <div className='flex-div p-form-infotab-bottom'>
                <div className='p-form-occupation-block'>
                    <div className='p-form-occupation-list'>
                        {
                            occupationIds === null ?
                                <LoadingScreen/> :
                                occupationIds!.map((occupationId: string) =>
                                    <DetailButton
                                        state={professional.occupations.includes(occupationId) ? 'selected' : 'active'}
                                        title={occupationCache[occupationId].name}
                                        onClickButton={() => {
                                            let occupations = [...professional.occupations]

                                            occupations.includes(occupationId) ?
                                                occupations = occupations.filter(i => i !== occupationId) :
                                                occupations.push(occupationId)

                                            updateProfessional(professional, setProfessional, 'occupations', occupations)
                                        }}
                                    />
                                )
                        }

                    </div>
                    <Input
                        label="Não encontrou sua ocupação?"
                        value={occupation.name}
                        onValueChange={(e) => setOccupation({ name: e.target.value })}
                        placeholder="Digite a ocupação"
                    />
                    <SmallButton
                        state={occupation.name !== '' ? 'active' : 'inactive'}
                        title='Adicionar'
                        onClickButton={async () => {
                            if (occupation.name === '') return
                            setOccupationIds(null);

                            await addOccupation(occupation)
                            await getAllOccupations()

                            setOccupation({ name: '' })
                            setOccupationIds(Object.keys(occupationCache));

                        }}
                    />
                </div>
                <VerticalLine />
                <div className='p-form-photo-block'>
                    <IconButton2 state='active' title='Alterar Imagem' icon='a' onClickButton={handleButtonClick} />
                    <input
                        type="file"
                        id="fileInput"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <div className='p-form-photo-frame button'>
                        <img className='p-form-photo' src={professional.photo} />
                    </div>
                </div>
            </div>
        </div>
    )
}