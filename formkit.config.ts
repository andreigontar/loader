import { DefaultConfigOptions } from '@formkit/vue';

if (typeof global !== 'undefined') {
    (global as Record<string, any>).File = function () {};
}

const config: DefaultConfigOptions = {
    config: {
        classes: {
            inner: '$reset sh-inner',
            outer: '$reset sh-outer',
            wrapper: '$reset sh-wrapper',
            input: '$reset sh-input',
            label: '$reset sh-label',
            messages: 'sh-messages',
            message: 'sh-message',
        }
    }
};

export default config;