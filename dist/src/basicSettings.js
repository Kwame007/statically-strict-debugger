'use strict';
import General from "./general";
class Light extends General {
    constructor() {
        super();
        this.debounceTimeouts = new Map();
        this.sliderListeners = new Map();
    }
    notification(message) {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
    }
    displayNotification(message, position, container) {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }
    removeNotification(element) {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }
    lightSwitchOn(lightButtonElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
    }
    lightSwitchOff(lightButtonElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb_off.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
    }
    ;
    lightComponentSelectors(lightButtonElement) {
        const room = this.getSelectedComponentName(lightButtonElement);
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
    toggleLightSwitch(lightButtonElement) {
        const selectors = this.lightComponentSelectors(lightButtonElement);
        const { componentData: component, childElement, background } = selectors;
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity');
        if (!selectors.componentData) {
            console.error("Component data is undefined1.");
            return;
        }
        if (!component)
            return;
        component.isLightOn = !component.isLightOn;
        if (component.isLightOn) {
            this.lightSwitchOn(childElement);
            component.lightIntensity = 5;
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity);
            slider.value = component.lightIntensity.toString();
        }
        else {
            this.lightSwitchOff(childElement);
            this.handleLightIntensity(background, 0);
            slider.value = (0).toString();
        }
    }
    // first bug
    handleLightIntensitySlider(element, intensity) {
        const { componentData } = this.lightComponentSelectors(element);
        if (!componentData) {
            console.error("Component data is undefined2.");
            return;
        }
        if (typeof intensity !== 'number' || Number.isNaN(intensity))
            return;
        componentData.lightIntensity = intensity;
        componentData.isLightOn = intensity > 0;
        const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch');
        if (lightSwitch) {
            this.sliderLight(componentData.isLightOn, lightSwitch);
        }
    }
    sliderLight(isLightOn, lightButtonElement) {
        const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity');
        if (!component || !childElement || !background) {
            console.error("Required elements not found");
            return;
        }
        if (isLightOn) {
            this.lightSwitchOn(childElement);
            component.lightIntensity = component.lightIntensity || 5;
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity);
            if (slider)
                slider.value = component.lightIntensity.toString();
        }
        else {
            this.lightSwitchOff(childElement);
            this.handleLightIntensity(background, 0);
            if (slider)
                slider.value = "0";
        }
        // Remove existing listener if any
        if (slider) {
            const existingListener = this.sliderListeners.get(slider);
            if (existingListener) {
                slider.removeEventListener('input', existingListener);
            }
            // Add new listener
            const listener = (event) => {
                const existingTimeout = this.debounceTimeouts.get(slider);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }
                const timeout = setTimeout(() => {
                    const newIntensity = parseInt(event.target.value, 10);
                    if (!isNaN(newIntensity)) {
                        component.lightIntensity = newIntensity;
                        const lightIntensity = newIntensity / 10;
                        this.handleLightIntensity(background, lightIntensity);
                    }
                }, 50);
                this.debounceTimeouts.set(slider, timeout);
            };
            slider.addEventListener('input', listener);
            this.sliderListeners.set(slider, listener);
        }
    }
}
export default Light;
