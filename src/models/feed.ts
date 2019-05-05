import Normalise from "../core/normaliser";
import { NotifyPropertyChanged, SubDocument } from "disharmony";

export default class Feed extends SubDocument implements NotifyPropertyChanged
{
    private maxHistoryCount = 10
    private history: string[] = []

    public id: string
    public url: string
    public channelId: string
    public roleId: string

    public isLinkInHistory(link: string): boolean
    {
        return this.history.indexOf(Normalise.forCache(link)) > -1
    }

    public pushHistory(...links: string[])
    {
        const newLinks = links.map(x => Normalise.forCache(x)).filter(x => !this.isLinkInHistory(x))
        Array.prototype.push.apply(this.history, newLinks)
        this.history.splice(0, this.history.length - this.maxHistoryCount)
        this.onPropertyChanged.dispatch("history")
    }

    public toRecord()
    {
        return {
            id: this.id,
            url: this.url,
            channelId: this.channelId,
            roleId: this.roleId,
            history: this.history,
        }
    }

    public loadRecord(record: any)
    {
        [this.record, this.url, this.channelId, this.roleId, this.history] = record
    }

    public static create(id: string, url: string, channelId: string, roleId?: string): Feed
    {
        const feed = new Feed()
        feed.id = id
        feed.url = url
        feed.channelId = channelId

        if (roleId)
            feed.roleId = roleId
        
        return feed
    }
}