import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import FormItemComponent from './FormItemComponent';
import AdditionalItemsComponent from './AdditionalItemsComponent';
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

function PrintLocationsComponent(props) {
    const [printLocations, setPrintLocations] = useState();

    useEffect(() => {
        setPrintLocations(props.defaultPrintLocations);
    }, []);

    const handleAdditionalItemsChange = (inputName, item) => {
        props.handleAdditionalItemsChange(inputName, item)
    }

    const handlePrintLocations = (inputName, handleType, shouldKeep) => {
        const currentPrintLocation = printLocations.filter(obj => obj.register === inputName)[0];
        if (handleType === 'add') {
            const currentValue = parseInt(currentPrintLocation.sortValue)
            const newLocationValue = currentValue + 1;
            const newLocationObject = {
                text: `Print Location ${newLocationValue}: Amt of colors`,
                value: 1,
                style: null,
                register: `printSide${newLocationValue}Colors`,
                required: false,
                errorDisplayMessage: `Print location ${newLocationValue}: Amt of colors `,
                inputValueType: 'integer',
                maxValue: 6,
                additionalItems: true,
                sortValue: newLocationValue,
            }
            const newData = [...printLocations, newLocationObject]
            setPrintLocations(newData);
            props.addPrintLocation(newLocationObject)
        }
        if (handleType === 'delete') {
            if (shouldKeep) {

            }
            else {
                const newData = [...printLocations];
                newData.pop();
                setPrintLocations(newData);
                props.removePrintLocation();
            }
        }
    }

    const handleDropdownChange = async (event, inputName) => {
        props.handleDropdownChange(event, inputName);
    }

    const renderPrintLocations = () => {
        return (
            printLocations.map((printLocation, index) => {
                return (
                    <>
                        <Column style={{ border: '1px dotted black', borderRadius: '3px', marginBottom: '10px' }}>
                            <FormItemComponent
                                register={printLocation.register}
                                text={printLocation.text}
                                dropdown
                                dropdownOptions={[
                                    { value: 0, label: '0' },
                                    { value: 1, label: '1' },
                                    { value: 2, label: '2' },
                                    { value: 3, label: '3' },
                                    { value: 4, label: '4' },
                                    { value: 5, label: '5' },
                                    { value: 6, label: '6' },
                                ]}
                                handleDropdownChange={handleDropdownChange}
                                defaultDropdownValue={{ value: '1', label: '1' }}
                            />
                            <AdditionalItemsComponent
                                handleChange={handleAdditionalItemsChange}
                                register={printLocation.register}
                                displayText={'Additional Items'}
                                selectedAdditionalItems={props.selectedAdditionalItems}
                            />
                            <Row style={{ margin: '10px' }} key={index} vertical='center' horizontal='space-around'>
                                {index + 1 === printLocations.length ?
                                    <>
                                        <Column
                                            style={{ border: '1px dotted grey', borderRadius: '3px', cursor: 'pointer', padding: '10px' }}
                                            onClick={() => handlePrintLocations(printLocation.register, 'delete', index === 0)}
                                        >
                                            <FaTrash size='16px'
                                                disabled={true}
                                            />
                                        </Column>
                                        <Column style={{ border: '1px dotted grey', borderRadius: '3px', cursor: 'pointer', padding: '10px' }}
                                            onClick={() => handlePrintLocations(printLocation.register, 'add')}
                                        >
                                            <FaPlus size='16px' />
                                        </Column>
                                    </>
                                    :
                                    <Column style={{ padding: '10px' }}>
                                    </Column>
                                }
                            </Row>
                        </Column>
                    </>
                )
            })
        )
    }

    return (
        <Column>
            {printLocations && printLocations.map && printLocations.length > 0 ?
                renderPrintLocations()
                :
                null
            }
        </Column>
    );
}

export default PrintLocationsComponent;
