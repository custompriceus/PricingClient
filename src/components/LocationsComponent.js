import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import FormItemComponent from './FormItemComponent';
import AdditionalItemsComponent from './AdditionalItemsComponent';
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

function LocationsComponent(props) {
    const [locations, setLocations] = useState();

    useEffect(() => {
        setLocations(props.defaultLocations);
    }, []);

    const handleAdditionalItemsChange = (inputName, item) => {
        props.handleAdditionalItemsChange(inputName, item)
    }

    const handleLocations = (inputName, handleType, shouldKeep) => {
        const currentLocation = locations.filter(obj => obj.register === inputName)[0];
        if (handleType === 'add') {
            const currentValue = parseInt(currentLocation.sortValue)
            const newLocationValue = currentValue + 1;
            const newLocationObject = {
                text: `${props.textPrefix} ${newLocationValue} - ${props.textSuffix}:`,
                value: 1,
                style: null,
                register: `${props.registerPrefix}${newLocationValue}${props.registerSuffix}`,
                required: false,
                errorDisplayMessage: `${props.textPrefix} ${newLocationValue} - ${props.textSuffix}`,
                inputValueType: 'integer',
                maxValue: 6,
                additionalItems: true,
                sortValue: newLocationValue,
            }
            const newData = [...locations, newLocationObject]
            setLocations(newData);
            props.addLocation(newLocationObject)
        }
        if (handleType === 'delete') {
            if (shouldKeep) {

            }
            else {
                const newData = [...locations];
                newData.pop();
                setLocations(newData);
                props.removeLocation();
            }
        }
    }

    const handleDropdownChange = async (event, inputName) => {
        props.handleDropdownChange(event, inputName);
    }

    const handleChange = async (event, inputName) => {
        props.handleChange(event, inputName, props.locationsInputType);
    }

    const renderLocations = () => {
        return (
            locations.map((location, index) => {
                return (
                    <>
                        <Row>
                            <Column flex={.05}
                                style={{ marginTop: '10px', marginBottom: '10px' }}
                            >
                                {index + 1 === locations.length ?
                                    <>
                                        <Row
                                            flex={1}
                                            style={{ width: '100%', cursor: 'pointer' }}
                                            vertical='center'
                                            horizontal='center'
                                            onClick={() => handleLocations(location.register, 'delete', index === 0)}
                                        >
                                            <FaTrash size='16px' disabled={true} />
                                        </Row>
                                        <Row
                                            flex={1}
                                            style={{ width: '100%', cursor: 'pointer' }}
                                            vertical='center'
                                            horizontal='center'
                                            onClick={() => handleLocations(location.register, 'add')}
                                        >
                                            <FaPlus size='16px' />
                                        </Row>
                                    </>
                                    : null}
                            </Column>
                            <Column flex={0.95}
                                style={{ border: '1px dotted grey', borderRadius: '3px', padding: '10px', marginLeft: '5px', marginRight: '5px', marginTop: '10px', marginBottom: '10px' }}
                                vertical='center'
                            >
                                <FormItemComponent
                                    register={location.register}
                                    text={location.text}
                                    dropdown={props.dropdown ? true : false}
                                    dropdownOptions={props.dropdownOptions ? props.dropdownOptions : null}
                                    handleDropdownChange={props.handleDropdownChange ? handleDropdownChange : null}
                                    handleChange={props.handleChange ? handleChange : null}
                                    defaultDropdownValue={{ value: '1', label: '1' }}
                                />
                                {props.selectedAdditionalItems ? <AdditionalItemsComponent
                                    handleChange={handleAdditionalItemsChange}
                                    register={location.register}
                                    displayText={'Additional Information - Mark if any of the following:'}
                                    selectedAdditionalItems={props.selectedAdditionalItems}
                                /> : null}

                            </Column>
                        </Row>
                    </>
                )
            })
        )
    }

    return (
        <Column>
            {locations && locations.map && locations.length > 0 ?
                renderLocations()
                :
                null
            }
        </Column>
    );
}

export default LocationsComponent;
