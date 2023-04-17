import MonitorSteps from 'Common/Types/Monitor/MonitorSteps';
import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import MonitorStepElement from './MonitorStep';
import { DropdownOption } from 'CommonUI/src/Components/Dropdown/Dropdown';
import MonitorStep from 'Common/Types/Monitor/MonitorStep';
import ModelAPI, { ListResult } from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import MonitorStatus from 'Model/Models/MonitorStatus';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import API from 'CommonUI/src/Utils/API/API';
import ComponentLoader from 'CommonUI/src/Components/ComponentLoader/ComponentLoader';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import { CustomElementProps } from 'CommonUI/src/Components/Forms/Types/Field';
import MonitorType from 'Common/Types/Monitor/MonitorType';

export interface ComponentProps extends CustomElementProps {
    error?: string | undefined;
    onChange?: ((value: MonitorSteps) => void) | undefined;
    onBlur?: () => void;
    initialValue?: MonitorSteps;
    monitorType: MonitorType;
}

const MonitorStepsElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [monitorStatusDropdownOptions, setMonitorStatusDropdownOptions] =
        React.useState<Array<DropdownOption>>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    const fetchMonitorStatuses: Function = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const list: ListResult<MonitorStatus> = await ModelAPI.getList(
                MonitorStatus,
                {},
                LIMIT_PER_PROJECT,
                0,
                {
                    name: true,
                },
                {},
                {}
            );

            if (list.data) {
                setMonitorStatusDropdownOptions(
                    list.data.map((i: MonitorStatus) => {
                        return {
                            value: i._id!,
                            label: i.name!,
                        };
                    })
                );
            }
        } catch (err) {
            setError(API.getFriendlyMessage(err));
        }

        setIsLoading(false);
    };
    useEffect(() => {
        fetchMonitorStatuses().catch();
    }, []);

    const [monitorSteps, setMonitorSteps] = React.useState<MonitorSteps>(
        props.initialValue || new MonitorSteps()
    );

    useEffect(() => {
        if (monitorSteps && props.onChange) {
            props.onChange(monitorSteps);
        }

        if (props.onBlur) {
            props.onBlur();
        }
    }, [monitorSteps]);

    if (error) {
        <ErrorMessage error={error}></ErrorMessage>;
    }

    if (isLoading) {
        return <ComponentLoader></ComponentLoader>;
    }

    return (
        <div>
            {monitorSteps.data?.monitorStepsInstanceArray.map(
                (i: MonitorStep, index: number) => {
                    return (
                        <MonitorStepElement
                            monitorType={props.monitorType}
                            key={index}
                            monitorStatusDropdownOptions={
                                monitorStatusDropdownOptions
                            }
                            initialValue={i}
                            onDelete={() => {
                                // remove the criteria filter
                                const index: number =
                                    monitorSteps.data?.monitorStepsInstanceArray.indexOf(
                                        i
                                    ) || -1;
                                const newMonitorStepss: Array<MonitorStep> = [
                                    ...(monitorSteps.data
                                        ?.monitorStepsInstanceArray || []),
                                ];
                                newMonitorStepss.splice(index, 1);
                                setMonitorSteps(
                                    new MonitorSteps().fromJSON({
                                        _type: 'MonitorSteps',
                                        value: {
                                            monitorStepsInstanceArray:
                                                newMonitorStepss,
                                        },
                                    })
                                );
                            }}
                            onChange={(value: MonitorStep) => {
                                const index: number =
                                    monitorSteps.data?.monitorStepsInstanceArray.indexOf(
                                        i
                                    ) || -1;
                                const newMonitorStepss: Array<MonitorStep> = [
                                    ...(monitorSteps.data
                                        ?.monitorStepsInstanceArray || []),
                                ];
                                newMonitorStepss[index] = value;
                                setMonitorSteps(
                                    new MonitorSteps().fromJSON({
                                        _type: 'MonitorSteps',
                                        value: {
                                            monitorStepsInstanceArray:
                                                newMonitorStepss,
                                        },
                                    })
                                );
                            }}
                        />
                    );
                }
            )}

            {/* <Button
                title="Add Step"
                onClick={() => {
                    const newMonitorSteps: Array<MonitorStep> = [
                        ...(monitorSteps.data?.monitorStepsInstanceArray || []),
                    ];
                    newMonitorSteps.push(new MonitorStep());

                    monitorSteps.data = {
                        monitorStepsInstanceArray: newMonitorSteps,
                    };

                    setMonitorSteps(
                        new MonitorSteps().fromJSON(monitorSteps.toJSON())
                    );
                }}
            /> */}
        </div>
    );
};

export default MonitorStepsElement;
