import {ProductionProperties} from '../domain/Production';
import {Response} from 'express';
import DomainError from '../error/DomainError';

const dateToISO8501WithoutTimezoneMS = (date: Date): string => {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds()) +
        'Z';
};

export function jsonHttpOutput(res: Response): (props: ProductionProperties) => void {
    return function output(props: ProductionProperties): void {
        const { AvailabilityFromUtcIso, ... rest } = props;
        res.json({ AvailabilityFromUtcIso: dateToISO8501WithoutTimezoneMS(AvailabilityFromUtcIso), ... rest });
    }
}

export function errorHttpOutput(e: Error, res: Response): void {
    if (e instanceof DomainError) {
        res.status(400).json({ error: [ { message: e.message } ] });
        return;
    }
    res.status(500).send(e);
}
