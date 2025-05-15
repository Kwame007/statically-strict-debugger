'use strict'

import General from "./general";
import Light from './basicSettings';

// Add Component interface
interface Component {
    name: string;
    numOfLights: number;
    lightIntensity: number;
    isLightOn: boolean;
    autoOn: string;
    autoOff: string;
    usage: number[];
    element?: HTMLElement | Element | null;
    [key: string]: any;  // Allow additional properties
}

interface ComponentsData {
    [key: string]: Component;
}

// Proper type definition for Chart.js
declare const Chart: {
    new (ctx: HTMLCanvasElement, config: any): any;
};

interface ChartData {
    type: string;
    data: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            borderWidth: number;
        }>;
    };
    options: {
        scales: {
            y: {
                beginAtZero: boolean;
            };
        };
    };
}

class AdvanceSettings extends Light {
    public componentsData!: ComponentsData;

    constructor () {
        super();
    }

    #markup(component: Component): string {
        const {name, numOfLights, autoOn, autoOff} = component;
        return `
        <div class="advanced_features">
            <h3>Advanced features</h3>
            <section class="component_summary">
                <div>
                    <p class="component_name">${this.capFirstLetter(name)}</p>
                    <p class="number_of_lights">${numOfLights}</p>
                </div>
                <div>

                    <p class="auto_on">
                        <span>Automatic turn on:</span>
                        <span>${autoOn}</span>
                    </p>
                    <p class="auto_off">
                        <span>Automatic turn off:</span>
                        <span>${autoOff}</span>
                    </p>
                </div>
            </section>
            <section class="customization">
                <div class="edit">
                    <p>Customize</p>
                    <button class="customization-btn">
                        <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
                    </button>
                </div>
                <section class="customization-details hidden">
                    <div>
                        <h4>Automatic on/off settings</h4>
                        <div class="defaultOn">
                            <label for="">Turn on</label>
                            <input type="time" name="autoOnTime" id="autoOnTime">
                            <div>
                                <button class="defaultOn-okay">Okay</button>
                                <button class="defaultOn-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="defaultOff">
                            <label for="">Go off</label>
                            <input type="time" name="autoOffTime" id="autoOffTime">
                            <div>
                                <button class="defaultOff-okay">Okay</button>
                                <button class="defaultOff-cancel">Cancel</button>
                            </div>
                        </div>

                    </div>
                </section>
                <section class="summary">
                    <h3>Summary</h3>
                    <div class="chart-container">
                        <canvas id="myChart"></canvas>
                    </div>
                </section>
                <button class="close-btn">
                    <img src="./assets/svgs/close.svg" alt="close button svg icon">
                </button>
            </section>
            <button class="close-btn">
                <img src="./assets/svgs/close.svg" alt="close button svg icon">
            </button>
        </div>
        `
    }

    #analyticsUsage(data: number[]) {
        const ctx = this.selector('#myChart') as HTMLCanvasElement;
        if (!ctx) {
            console.error('Canvas element not found');
            return;
        }

        const chartConfig: ChartData = {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Hours of usage',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        new Chart(ctx, chartConfig);
    }

    modalPopUp(element: HTMLElement): void {
        const selectedRoom = this.getSelectedComponentName(element);
        const componentData = this.getComponent(selectedRoom as string) as Component | undefined;
        if (!componentData) {
            console.error('Component data not found');
            return;
        }
        const parentElement = this.selector('.advanced_features_container');
        if (!parentElement) {
            console.error('Parent element not found');
            return;
        }
        this.removeHidden(parentElement as HTMLElement);
        
        // display modal view
        this.renderHTML(this.#markup(componentData), 'afterbegin', parentElement as HTMLElement);

        // graph display
        this.#analyticsUsage(componentData.usage);
    }

    displayCustomization(selectedElement:HTMLElement) {
        const element = this.closestSelector(selectedElement, '.customization', '.customization-details')
        this.toggleHidden(element as HTMLElement);
    }

    closeModalPopUp() {
        const parentElement = this.selector('.advanced_features_container');
        const childElement = this.selector('.advanced_features');

        // remove child element from the DOM
        childElement?.remove()
        // hide parent element
        this.addHidden(parentElement as HTMLElement);
    }

    customizationCancelled(selectedElement:HTMLElement, parentSelectorIdentifier:string) {
        const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input') as HTMLInputElement;
        element.value = '';
        return;
    }

    customizeAutomaticOnPreset(selectedElement: HTMLElement) {
        const element = this.closestSelector(selectedElement, '.defaultOn', 'input') as HTMLInputElement;
        const { value } = element;
        
        // Check for empty or invalid value
        if (!value) {
            console.error('No time value provided');
            return;
        }

        const inputElement = element as HTMLInputElement;
        const component = this.getComponentData(inputElement, '.advanced_features', '.component_name');
        if (!component) {
            console.error('Component data not found');
            return;
        }

        component.autoOn = value;
        inputElement.value = '';

        // selecting display or markup view
        const spanElement = this.selector('.auto_on > span:last-child');
        if (spanElement) {
            this.updateMarkupValue(spanElement as HTMLElement, component.autoOn);
        }

        // update room data with element
        this.setComponentElement(component);
        
        // handle light on automation
        this.automateLight(component.autoOn, component);
    }

    customizeAutomaticOffPreset(selectedElement: HTMLElement) {
        const element = this.closestSelector(selectedElement, '.defaultOff', 'input') as HTMLInputElement;
        const { value } = element;

        // Check for empty or invalid value
        if (!value) {
            console.error('No time value provided');
            return;
        }
        
        const component = this.getComponentData(element as HTMLElement, '.advanced_features', '.component_name');
        if (!component) {
            console.error('Component data not found');
            return;
        }

        component.autoOff = value;
        element.value = '';

        // selecting display or markup view
        const spanElement = this.selector('.auto_off > span:last-child');
        if (spanElement) {
            this.updateMarkupValue(spanElement as HTMLElement, component.autoOff);
        }

        // update room data with element
        this.setComponentElement(component);
        
        // handle light on automation
        this.automateLight(component.autoOff, component);
    }

    getSelectedComponent(componentName: string): Component | ComponentsData {
        if (!componentName) return this.componentsData;
        const component = this.componentsData[componentName.toLowerCase()];
        return component;
    }

    getSelectedSettings(componentName: string): string {
        return this.#markup(this.getSelectedComponent(componentName) as Component);
    }

    setNewData(component: string, key: keyof Component, data: any): any {
        const selectedComponent = this.componentsData[component.toLowerCase()];
        return selectedComponent[key] = data;
    }

    getComponentData(element: HTMLElement, ancestorIdentifier: string, childElement: string): Component | undefined {
        const parentElement = element.closest(ancestorIdentifier);
        if (!parentElement) {
            console.error(`Parent element with identifier "${ancestorIdentifier}" not found`);
            return undefined;
        }

        const nameElement = parentElement.querySelector(childElement);
        if (!nameElement || !nameElement.textContent) {
            console.error(`Child element "${childElement}" not found or has no text content`);
            return undefined;
        }

        const componentName = nameElement.textContent.toLowerCase().trim();
        const component = this.getSelectedComponent(componentName) as Component | undefined;
        if (!component) {
            console.error(`Component "${componentName}" not found`);
            return undefined;
        }

        return component;
    }

    capFirstLetter (word:string) : string {
        if (!word) return word;
        return word[0].toUpperCase();
    }

    getObjectDetails() {
        return this;
    }

    formatTime(time: string): Date {
        const [hour, min] = time.split(':');
        
        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(parseInt(hour)); 
        dailyAlarmTime.setMinutes(parseInt(min));
        dailyAlarmTime.setSeconds(0);
        
        return dailyAlarmTime;
    }

    timeDifference(selectedTime: string): number {
        const now = new Date();
        const setTime = this.formatTime(selectedTime).getTime() - now.getTime();
        return setTime;
    }

    async timer(time: Date, component: Component): Promise<void> {
        return new Promise((resolve, reject) => {
            let intervalId: number;

            const cleanup = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };

            try {
                const checkAndTriggerAlarm = () => {
                    const now = new Date();
                    
                    if (
                        now.getHours() === time.getHours() &&
                        now.getMinutes() === time.getMinutes() &&
                        now.getSeconds() === time.getSeconds()
                    ) {
                        cleanup();
                        const element = component.element as HTMLElement;
                        if (!element) {
                            reject(new Error('Component element not found'));
                            return;
                        }
                        resolve(this.toggleLightSwitch(element));
                    }
                };
            
                // Check every second
                intervalId = window.setInterval(checkAndTriggerAlarm, 1000);

                // Safety timeout after 24 hours
                setTimeout(() => {
                    cleanup();
                    reject(new Error('Timer exceeded 24 hours'));
                }, 24 * 60 * 60 * 1000);

            } catch (error) {
                cleanup();
                reject(error);
            }
        });
    }

    async automateLight(time: string, component: Component): Promise<void> {
        try {
            const formattedTime = this.formatTime(time);
            if (!formattedTime) {
                throw new Error('Invalid time format');
            }
            return await this.timer(formattedTime, component);
        } catch (error) {
            console.error('Error in automateLight:', error);
            throw error;
        }
    }
}

export default AdvanceSettings;
