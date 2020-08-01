import InvalidArgumentError from '../error/InvalidArgumentError';
import * as z from 'zod';
import ValidationError from '../error/ValidationError';
import DomainError from '../error/DomainError';
import {ZodSuberror} from 'zod/lib/src/ZodError';

// this validation is close to the entity, no need to extract or make it replaceable as it might damage integrity
const productionSchema = z.object({
    Abstract: z.string(),
    // @todo test accepted values (maybe make it strict to 12, 16, 18)
    AgeRating: z.number(),
    AvailabilityFromUtcIso: z.date(),
    BackgroundUrl: z.string(),
    Cast: z.string(),
    Category: z.enum(['SERIES', 'MOVIE']),
    Director: z.string(),
    EditedAbstract: z.string(),
    Genre: z.string(),
    Id: z.string().uuid(),
    Name: z.string(),
    ProductionYear: z.number().min(1888)
});

const productionJsonSchema = productionSchema.extend({
    AvailabilityFromUtcIso: z.string()
});

export type ProductionProperties = z.TypeOf<typeof productionSchema>;

const ProductionValidator = z.function(z.tuple([productionJsonSchema]), productionSchema);
const productionJsonValidator = ProductionValidator.validate(input => {
    const {AvailabilityFromUtcIso, ...result} = {...input};
    const availabilityFromUtcIsoDate = new Date(AvailabilityFromUtcIso);
    return { AvailabilityFromUtcIso: availabilityFromUtcIsoDate, ...result };
});

const partialProductionSchema = productionSchema.omit({ Id: true }).partial();
const partialProductionJsonSchema = productionJsonSchema.omit({ Id: true }).partial();
const PartialProductionValidator = z.function(z.tuple([partialProductionJsonSchema]), partialProductionSchema);
const partialProductionJsonValidator = PartialProductionValidator.validate(input => {
    const {AvailabilityFromUtcIso, ...result} = {...input};
    if (AvailabilityFromUtcIso) {
        const availabilityFromUtcIsoDate = new Date(AvailabilityFromUtcIso);
        return { AvailabilityFromUtcIso: availabilityFromUtcIsoDate, ...result };
    }
    return result;
});

const zodErrorToDomainError = (input: any, error: ZodSuberror): DomainError => {
    let message;
    switch (error.code) {
        // @todo add errors, but now others are not important at the moment
        case 'invalid_arguments':
            message = error.argumentsError.message;
    }
    return ValidationError.whenValidating(JSON.stringify(input), 'Production', message);
}

export class Production {

    public constructor(private properties: ProductionProperties) {
    }

    // @todo maybe export to a dedicated factory
    public static fromJson(json: string): Production {
        let data = {};
        try {
            data = JSON.parse(json);
            return new Production(productionJsonValidator(data));
        } catch (e) {
            if (e instanceof z.ZodError) {
               throw zodErrorToDomainError(data, e.errors[0]);
            }
            throw InvalidArgumentError.whenReceiving(json);
        }
    }

    // @todo maybe refactor to update(ProductionProperties) and move validation to a transform fn
    public updateFromJson(json: string) {
        let data = {};
        try {
            data = JSON.parse(json);
            const mergeWithProperties = partialProductionJsonValidator(data);
            this.properties = { ... this.properties, ... mergeWithProperties };
        } catch (e) {
            if (e instanceof z.ZodError) {
                throw zodErrorToDomainError(data, e.errors[0]);
            }
            throw InvalidArgumentError.whenReceiving(json);
        }
    }

    public output(channel: (production: ProductionProperties) => void): void {
        channel({ ... this.properties });
    }

    public save(storage: (production: ProductionProperties) => Promise<void>): Promise<void> {
        return storage({ ... this.properties });
    }

    // Calling delete couldve been avoided by moving lifecycle events to use cases but that would
    // breach single responsibility as it also means a single concern should have one place
    public delete(storage: (id: string) => Promise<void>): Promise<void> {
        return storage(this.properties.Id);
    }
}
