'use strict'

import General from "./general";

class Light extends General {
    private debounceTimeouts: Map<HTMLElement, number> = new Map();
    private sliderListeners: Map<HTMLElement, EventListener> = new Map();

    constructor() {
        super();
    }

    notification (message: string) {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;

    }

    displayNotification (message:string, position:InsertPosition, container:HTMLElement) {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }

    removeNotification (element:HTMLElement) {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }

    lightSwitchOn (lightButtonElement:HTMLElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
    }

    lightSwitchOff (lightButtonElement:HTMLElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb_off.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
    };

    lightComponentSelectors(lightButtonElement:HTMLElement) {
        const room = this.getSelectedComponentName(lightButtonElement) as string;
        if (!room) {
            return { room: null, componentData: null, childElement: null, background: null };
        }
        const componentData = this.getComponent(room);
        if (!componentData) {
            console.error(`Component data for room "${room}" is undefined.`);
        }
        const childElement = lightButtonElement.firstElementChild;
        const background = this.closestSelector(lightButtonElement, '.rooms', 'img');
        return { room, componentData, childElement, background };
        
    }

    toggleLightSwitch(lightButtonElement:HTMLElement) {
        const selectors = this.lightComponentSelectors(lightButtonElement);
        const { componentData: component, childElement, background } = selectors;
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity') as HTMLInputElement;
        if (!selectors.componentData) {
            console.error("Component data is undefined1.");
            return;
        }

        if (!component) return;

        component.isLightOn = !component.isLightOn;

        if (component.isLightOn) {
            this.lightSwitchOn(childElement as HTMLElement);
            component.lightIntensity = 5;
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background as HTMLElement , lightIntensity);
            slider.value = component.lightIntensity.toString();
        } else {
            this.lightSwitchOff(childElement as HTMLElement);
            this.handleLightIntensity(background as HTMLElement, 0);
            slider.value = (0).toString();
        }
    }
    // first bug

    handleLightIntensitySlider(element: HTMLElement, intensity: number): void {
        const { componentData } = this.lightComponentSelectors(element);

        if (!componentData) {
            console.error("Component data is undefined2.");
            return;
        }

        if (typeof intensity !== 'number' || Number.isNaN(intensity)) return;

        componentData.lightIntensity = intensity;
        componentData.isLightOn = intensity > 0;
    
        const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch');
        if (lightSwitch) {
            this.sliderLight(componentData.isLightOn, lightSwitch as HTMLElement);
        }
    }

    sliderLight(isLightOn: boolean, lightButtonElement: HTMLElement): void {
        const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity') as HTMLInputElement;

        if (!component || !childElement || !background) {
            console.error("Required elements not found");
            return;
        }

        if (isLightOn) {
            this.lightSwitchOn(childElement as HTMLElement);
            component.lightIntensity = component.lightIntensity || 5;
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background as HTMLElement, lightIntensity);
            if (slider) slider.value = component.lightIntensity.toString();
        } else {
            this.lightSwitchOff(childElement as HTMLElement);
            this.handleLightIntensity(background as HTMLElement, 0);
            if (slider) slider.value = "0";
        }

        // Remove existing listener if any
        if (slider) {
            const existingListener = this.sliderListeners.get(slider);
            if (existingListener) {
                slider.removeEventListener('input', existingListener);
            }

            // Add new listener
            const listener = (event: Event) => {
                const existingTimeout = this.debounceTimeouts.get(slider);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }

                const timeout = setTimeout(() => {
                    const newIntensity = parseInt((event.target as HTMLInputElement).value, 10);
                    if (!isNaN(newIntensity)) {
                        component.lightIntensity = newIntensity;
                        const lightIntensity = newIntensity / 10;
                        this.handleLightIntensity(background as HTMLElement, lightIntensity);
                    }
                }, 50);

                this.debounceTimeouts.set(slider, timeout as unknown as number);
            };

            slider.addEventListener('input', listener);
            this.sliderListeners.set(slider, listener);
        }
    }

}



export default Light;