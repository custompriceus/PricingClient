import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock } from 'react-icons/fi';
import AwesomeButtonComponent from '../components/AwesomeButtonComponent';

function FormComponent(props) {
    const [formItems, setFormItems] = useState();
    const [displayToggle, setDisplayToggle] = useState();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur",
    });

    useEffect(() => {
        setFormItems(props.formItems);
    }, [props.formItems]);

    const renderFormItem = (item) => {
        const Icon = item.register === 'email' ? FiMail : FiLock;

        return (
            <div className="mb-4" key={item.text}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.text}
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Icon className="h-5 w-5" />
                    </span>
                    <input
                        defaultValue={item.value || ''}
                        type={item.type || 'text'}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        {...register(item.register)}
                    />
                </div>
                {item.error && (
                    <p className="mt-1 text-sm text-red-600">
                        {item.errorDisplayMessage}
                    </p>
                )}
            </div>
        );
    };

    if (!formItems) return null;

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => {
                props.handleSubmit(data, displayToggle);
                reset();
            })}
        >
            {formItems && formItems.map(renderFormItem)}

            {props.error && (
                <div className="text-center text-sm text-red-600">
                    {props.error}
                </div>
            )}

            {!props.hideButton && (
                <div className="flex justify-center">
                    {/* <AwesomeButtonComponent
                        text={props.text || 'Get Price Quote'}
                    /> */}
                    <button type='submit' class="bg-black text-sm hover:bg-black-700 text-white  py-2 px-4 rounded">
                        {props.text || 'Get Price Quote'}
                    </button>
                </div>
            )}
        </form>
    );
}

export default FormComponent;
