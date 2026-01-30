import { ROOMS } from '../domain/rooms';

export const createReservationSchema = {
    body: {
        type: 'object',
        required: ['roomId', 'userId', 'startTime', 'endTime'],
        properties: {
            roomId: { type: 'string', enum: [...ROOMS] },
            userId: { type: 'string', minLength: 1 },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
        },
        additionalProperties: false,
    },
} as const;

export const deleteReservationSchema = {
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
