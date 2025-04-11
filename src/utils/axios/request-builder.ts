export interface IRequestBuilder {
  setPrefix(prefix: string): this;
  setVersion(version: string): this;
  setResourcePath(resourcePath: string): this;
  buildUrl(additionalPath?: string): string;
}
export class RequestBuilder implements IRequestBuilder {
  private prefix: string = 'api';
  private version: string = 'v1';
  private resourcePath?: string;
  setPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }
  setVersion(version: string): this {
    this.version = version;
    return this;
  }
  setResourcePath(resourcePath: string): this {
    this.resourcePath = resourcePath;
    return this;
  }
  buildUrl(additionalPath?: string): string {
    const baseUrl = `/${this.prefix}/${this.version}/${this.resourcePath}`;
    return additionalPath ? `${baseUrl}/${additionalPath}` : baseUrl;
  }
}
