'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AdvanceSettings_instances, _AdvanceSettings_markup, _AdvanceSettings_analyticsUsage;
import Light from './basicSettings';
class AdvanceSettings extends Light {
    constructor() {
        super();
        _AdvanceSettings_instances.add(this);
    }
    modalPopUp(element) {
        const selectedRoom = this.getSelectedComponentName(element);
        const componentData = this.getComponent(selectedRoom);
        if (!componentData) {
            console.error('Component data not found');
            return;
        }
        const parentElement = this.selector('.advanced_features_container');
        if (!parentElement) {
            console.error('Parent element not found');
            return;
        }
        this.removeHidden(parentElement);
        // display modal view
        this.renderHTML(__classPrivateFieldGet(this, _AdvanceSettings_instances, "m", _AdvanceSettings_markup).call(this, componentData), 'afterbegin', parentElement);
        // graph display
        __classPrivateFieldGet(this, _AdvanceSettings_instances, "m", _AdvanceSettings_analyticsUsage).call(this, componentData.usage);
    }
    displayCustomization(selectedElement) {
        const element = this.closestSelector(selectedElement, '.customization', '.customization-details');
        this.toggleHidden(element);
    }
    closeModalPopUp() {
        const parentElement = this.selector('.advanced_features_container');
        const childElement = this.selector('.advanced_features');
        // remove child element from the DOM
        childElement === null || childElement === void 0 ? void 0 : childElement.remove();
        // hide parent element
        this.addHidden(parentElement);
    }
    customizationCancelled(selectedElement, parentSelectorIdentifier) {
        const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input');
        element.value = '';
        return;
    }
    customizeAutomaticOnPreset(selectedElement) {
        const element = this.closestSelector(selectedElement, '.defaultOn', 'input');
        const { value } = element;
        // Check for empty or invalid value
        if (!value) {
            console.error('No time value provided');
            return;
        }
        const inputElement = element;
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
            this.updateMarkupValue(spanElement, component.autoOn);
        }
        // update room data with element
        this.setComponentElement(component);
        // handle light on automation
        this.automateLight(component.autoOn, component);
    }
    customizeAutomaticOffPreset(selectedElement) {
        const element = this.closestSelector(selectedElement, '.defaultOff', 'input');
        const { value } = element;
        // Check for empty or invalid value
        if (!value) {
            console.error('No time value provided');
            return;
        }
        const component = this.getComponentData(element, '.advanced_features', '.component_name');
        if (!component) {
            console.error('Component data not found');
            return;
        }
        component.autoOff = value;
        element.value = '';
        // selecting display or markup view
        const spanElement = this.selector('.auto_off > span:last-child');
        if (spanElement) {
            this.updateMarkupValue(spanElement, component.autoOff);
        }
        // update room data with element
        this.setComponentElement(component);
        // handle light on automation
        this.automateLight(component.autoOff, component);
    }
    getSelectedComponent(componentName) {
        if (!componentName)
            return this.componentsData;
        const component = this.componentsData[componentName.toLowerCase()];
        return component;
    }
    getSelectedSettings(componentName) {
        return __classPrivateFieldGet(this, _AdvanceSettings_instances, "m", _AdvanceSettings_markup).call(this, this.getSelectedComponent(componentName));
    }
    setNewData(component, key, data) {
        const selectedComponent = this.componentsData[component.toLowerCase()];
        return selectedComponent[key] = data;
    }
    capFirstLetter(word) {
        if (!word)
            return word;
        return word[0].toUpperCase();
    }
    getObjectDetails() {
        return this;
    }
    formatTime(time) {
        const [hour, min] = time.split(':');
        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(parseInt(hour));
        dailyAlarmTime.setMinutes(parseInt(min));
        dailyAlarmTime.setSeconds(0);
        return dailyAlarmTime;
    }
    timeDifference(selectedTime) {
        const now = new Date();
        const setTime = this.formatTime(selectedTime).getTime() - now.getTime();
        return setTime;
    }
    timer(time, component) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let intervalId;
                const cleanup = () => {
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                };
                try {
                    const checkAndTriggerAlarm = () => {
                        const now = new Date();
                        if (now.getHours() === time.getHours() &&
                            now.getMinutes() === time.getMinutes() &&
                            now.getSeconds() === time.getSeconds()) {
                            cleanup();
                            const element = component.element;
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
                }
                catch (error) {
                    cleanup();
                    reject(error);
                }
            });
        });
    }
    automateLight(time, component) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedTime = this.formatTime(time);
                if (!formattedTime) {
                    throw new Error('Invalid time format');
                }
                return yield this.timer(formattedTime, component);
            }
            catch (error) {
                console.error('Error in automateLight:', error);
                throw error;
            }
        });
    }
}
_AdvanceSettings_instances = new WeakSet(), _AdvanceSettings_markup = function _AdvanceSettings_markup(component) {
    const { name, numOfLights, autoOn, autoOff } = component;
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
        `;
}, _AdvanceSettings_analyticsUsage = function _AdvanceSettings_analyticsUsage(data) {
    const ctx = this.selector('#myChart');
    if (!ctx) {
        console.error('Canvas element not found');
        return;
    }
    const chartConfig = {
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
};
export default AdvanceSettings;
