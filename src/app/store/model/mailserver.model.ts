export interface mailserverModel {
  mailserverList: mailserver[]
}

export interface mailserver{
  mailSettingID: number,
  displayName: string | null,
  senderMail: string | null,
  password: string | null,
  mailServerInfo: string | null,
  portNo: string | null,
  enableSSL: boolean,
  serverType: string | null
}