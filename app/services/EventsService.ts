import EventsRepository from "@/infrastructure/database/repositories/EventsRepository";

export default class EventsService {
    eventsRepository: EventsRepository;

    constructor(eventsRepository: EventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    async createEvent(event: EventEntity): Promise<InsertResultInterface | null> {
        return await this.eventsRepository.createEvent(event);
    }

    async getEventById(id: number): Promise<EventEntity | null> {
        return await this.eventsRepository.getEventById(id);
    }

    async getEventsByPage(page?: number, limits?: number): Promise<EventEntity[] | null> {
        return await this.eventsRepository.getEventsByPage(page, limits);
    }
};