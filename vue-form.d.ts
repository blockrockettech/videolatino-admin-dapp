/** Declaration file generated by dts-gen */

export = vue_form;

declare function vue_form(...args: any[]): any;

declare namespace vue_form {
    const components: {
        field: {
            inject: {
                vueFormConfig: string;
            };
            props: {
                autoLabel: {
                    default: boolean;
                    type: any;
                };
                tag: {
                    type: any;
                };
            };
            render: any;
        };
        fieldMessages: {
            computed: {
                isShown: any;
            };
            created: any;
            data: any;
            inject: {
                vueFormConfig: string;
                vueFormParentForm: string;
                vueFormState: string;
            };
            props: {
                autoLabel: any;
                name: any;
                show: {
                    default: string;
                    type: any;
                };
                state: any;
                tag: {
                    type: any;
                };
            };
            render: any;
        };
        validate: {
            computed: {
                className: any;
                inputClassName: any;
            };
            created: any;
            data: any;
            destroyed: any;
            inject: {
                vueFormConfig: string;
                vueFormParentForm: string;
                vueFormState: string;
            };
            methods: {
                getClasses: any;
            };
            mounted: any;
            props: {
                autoLabel: any;
                custom: any;
                debounce: any;
                state: any;
                tag: {
                    type: any;
                };
            };
            render: any;
        };
        vueForm: {
            computed: {
                className: any;
            };
            created: any;
            data: any;
            inject: {
                vueFormConfig: string;
            };
            methods: {
                reset: any;
                validate: any;
            };
            props: {
                showMessages: any;
                state: {
                    required: boolean;
                    type: any;
                };
                tag: any;
            };
            provide: any;
            render: any;
        };
    };

    const directives: {
        vueFormValidator: {
            bind: any;
            name: string;
            update: any;
        };
    };

    const installed: boolean;

    function install(Vue: any, options: any): void;

    function provide(): any;

    namespace options {
        const components: {
            field: {
                inject: {
                    vueFormConfig: string;
                };
                props: {
                    autoLabel: {
                        default: boolean;
                        type: any;
                    };
                    tag: {
                        type: any;
                    };
                };
                render: any;
            };
            fieldMessages: {
                computed: {
                    isShown: any;
                };
                created: any;
                data: any;
                inject: {
                    vueFormConfig: string;
                    vueFormParentForm: string;
                    vueFormState: string;
                };
                props: {
                    autoLabel: any;
                    name: any;
                    show: {
                        default: string;
                        type: any;
                    };
                    state: any;
                    tag: {
                        type: any;
                    };
                };
                render: any;
            };
            validate: {
                computed: {
                    className: any;
                    inputClassName: any;
                };
                created: any;
                data: any;
                destroyed: any;
                inject: {
                    vueFormConfig: string;
                    vueFormParentForm: string;
                    vueFormState: string;
                };
                methods: {
                    getClasses: any;
                };
                mounted: any;
                props: {
                    autoLabel: any;
                    custom: any;
                    debounce: any;
                    state: any;
                    tag: {
                        type: any;
                    };
                };
                render: any;
            };
            vueForm: {
                computed: {
                    className: any;
                };
                created: any;
                data: any;
                inject: {
                    vueFormConfig: string;
                };
                methods: {
                    reset: any;
                    validate: any;
                };
                props: {
                    showMessages: any;
                    state: {
                        required: boolean;
                        type: any;
                    };
                    tag: any;
                };
                provide: any;
                render: any;
            };
        };

        const directives: {
            vueFormValidator: {
                bind: any;
                name: string;
                update: any;
            };
        };

        function provide(): any;

    }

}

