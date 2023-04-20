import React, { useState, useEffect } from 'react'

import { Input } from "../../../../components/input/input";
import { professionalType } from "../../../../controllers/professionalController";
import updateProfessional from "../../../../functions/updaters/update-professional";
import { professionalTabType } from "../professional-form";
import { addOccupation, getAllOccupations, occupationType } from '../../../../controllers/occupationController';

const occupationCache = require('../../../../cache/occupationCache.json')

export function InformationTab({ professional, setProfessional }: professionalTabType) {
    const [occupationIds, setOccupationIds] = useState<string[] | null>(null)
    const [occupation, setOccupation] = useState<occupationType>({
        name: ''
    })

    useEffect(() => {
        getAllOccupations().then(() => {
            setOccupationIds(Object.keys(occupationCache));
        });
    }, []);

    return (
        <div>
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
                placeholder="Digite o nome do serviço"
            />
            <p>adicionar lista de ocupações</p>
            {
                occupationIds == null ?
                    <p>loading</p> :
                    occupationIds!.map((occupationId: string) => {
                        return (
                            <div onClick={() => {
                                let occupations = [...professional.occupations]

                                occupations.includes(occupationId) ?
                                    occupations = occupations.filter(i => i !== occupationId) :
                                    occupations.push(occupationId)

                                updateProfessional(professional, setProfessional, 'occupations', occupations)
                            }} key={occupationId}>
                                <p>{occupationCache[occupationId].name} {professional.occupations.includes(occupationId) ? '-Selected' : null}</p>
                            </div>
                        )
                    })
            }
            <Input
                label="Não encontrou sua ocupação?"
                value={occupation.name}
                onValueChange={(e) => setOccupation({ name: e.target.value })}
                placeholder="Digite a ocupação"
            />
            {
                occupation.name !== '' ?
                    <button onClick={async () => {
                        setOccupationIds(null);

                        await addOccupation(occupation)
                        await getAllOccupations()

                        setOccupation({ name: '' })
                        setOccupationIds(Object.keys(occupationCache));

                    }}>Adiconar</button> : null
            }
        </div>
    )
}