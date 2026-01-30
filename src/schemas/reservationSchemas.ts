import { ROOMS } from '../domain/rooms';

const authHeaderSchema = {
    headers: {
        type: 'object',
        required: ['x-user-id'],
        properties: {
            'x-user-id': { type: 'string', minLength: 1 },
        },
    },
} as const;

export const createReservationSchema = {
    ...authHeaderSchema,
    body: {
        type: 'object',
        required: ['roomId', 'startTime', 'endTime'],
        properties: {
            roomId: { type: 'string', enum: [...ROOMS] },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
        },
        additionalProperties: false,
    },
} as const;

export const deleteReservationSchema = {
    ...authHeaderSchema,
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
    },
} as const;

export const getReservationsByRoomSchema = {
    params: {
        type: 'object',
        required: ['roomId'],
        properties: {
            roomId: { type: 'string', enum: [...ROOMS] },
        },
        additionalProperties: false,
    },
} as const;
