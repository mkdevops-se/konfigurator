import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeploymentsService } from '../deployments/deployments.service';
import { MockBuildInfoDto } from './dto/mock-build-info.dto';

@Injectable()
export class MockBuildInfoService {
  private readonly logger = new Logger(MockBuildInfoService.name);
  private readonly mockBuildInfos = {};
  private static sampleVersionNumbers = [
    '0.1.1',
    '0.1.2',
    '0.2.1',
    '0.2.3',
    '0.2.5',
    '0.3.1',
    '0.3.4',
    '0.3.5',
    '0.3.6',
    '0.4.1',
    '0.5.1',
    '0.5.2',
    '0.5.3',
    '0.5.4',
    '0.6.1',
    '0.6.2',
    '0.6.3',
    '0.6.4',
    '0.6.5',
    '0.7.1',
    '0.7.2',
    '0.7.3',
    '0.8.0',
    '0.8.1',
    '0.8.2',
    '0.9.1',
    '0.9.2',
    '0.10.1',
    '0.10.2',
    '0.10.3',
    '0.11.2',
    '0.12.3',
    '0.12.4',
    '0.13.0',
    '0.13.1',
    '0.13.4',
    '0.14.2',
    '0.15.1',
    '0.15.4',
    '0.16.0',
    '1.0.3',
    '1.0.1',
    '1.5.3',
    '1.12.0',
  ];
  private static sampleBuildSuffixes = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'rc1',
    'rc1',
    'rc1',
    'rc2',
    'rc2',
    'rc3',
    'rc3',
    'rc3',
    'rc4',
    'rc4',
    'rc4',
    'rc4',
    'rc5',
    'rc5',
    'rc5',
    'rc6',
    'rc6',
    'rc6',
    'rc9',
    'rc9',
    'rc9',
    'rc15',
    'rc15',
    'rc19',
    'rc19',
    'rc19',
    '_develop.dev134',
    '_develop.dev137',
    '_develop.dev139',
    '_develop.dev143',
    '_develop.dev146',
    '_develop.dev158',
    '_develop.dev163',
    '_develop.dev170',
    '_develop.dev191',
    '_bugfix.THEFARM.152.dev2',
    '_bugfix.THEFARM.154.fix.bad.ui.dev9',
    '_bugfix.THEFARM.201.dev1',
    '_bugfix.THEFARM.211.dev2',
    '_bugfix.THEFARM.221.dev4',
    '_bugfix.THEFARM.273.dev1',
    '_bugfix.THEFARM.310.wcag2.dev3',
    '_bugfix.THEFARM.342.less.slow.app.dev2',
    '_feature.THEFARM.135.cool.new.btn.dev4',
    '_feature.THEFARM.139.dev3',
    '_feature.THEFARM.145.more.stuff.dev1',
    '_feature.THEFARM.152.meow.meow.dev3',
    '_feature.THEFARM.155.bloat.it.yah.dev2',
    '_feature.THEFARM.158.moar.bloat.dev2',
    '_feature.THEFARM.231.dev5',
    '_feature.THEFARM.350.dev1',
  ];
  private static sampleCommitSha = [
    '847f1ee3594004a8d1431914cad41d38b985471d',
    '640382d453637e808c00f2d83404445272eccc13',
    '57be2ef1769e83c98b475ac63705f3b64ce78e6e',
    '690f82397292dfc845d946fdc0e02358de85c75e',
    'f3698dc07306c5dc9a430c217f0accc719e38973',
    '4e31eb1afc2742af318302c8797835655be9b30f',
    '79444b02484c6b31272f04e2adda4590690ae152',
    'b6589084748387f74f72d55ed2140eefc3f08a1f',
    '16cc2789d0bb2ab68c25d08e80c93f02d8af6cf3',
    '28ccc76b8727611bee86869c98924f78c55ee4c9',
    '9e7ad2dbeafd474e01125526266916d816a36163',
    'f4b9ede908dedacc25261b73981f8eb396e00ed2',
    'd83c493d09cc995ebc6be6b2e3f72a7e1fae8706',
    'ac92b52bbc1fb896e419ab7d2a429927ac349b03',
    '8c1c424ec5d90c682c4ba93c1534330092dde0aa',
    'a378cd32a42fb3921de92c8e201b5d223ba2562a',
    'cde21e2ed91ebb97bf58a1575f1523e924810c70',
    '09d1c002fa571fec760abd19df1fd6684d162953',
    '303b2496a96547d8189d1045193d9ea0a6a57130',
    'f2a8d313172912cd154feab809463e7867f4d9b6',
    '94e1412f66eb1a57c1238a1875c5b183efbadbdb',
    '63b66dbe967d3cfe9e5386dadf9ab814c1b29c58',
    '16f96416686c5d2160439c24761c593c46977ab9',
    '80210a9f55aa4963f768fbdac42ef42843a8303a',
    '315a8c384d0fb6291d63a89f03d214b82ac7ce6d',
    '3d28ad1f0d808691e0799d17c8840e044a7066c7',
    'a3c7c38c955ee4f175068ce523f76dcd79babd04',
    '69c892c4a971937b42c0df9d7d58888bb0f20d3f',
    'e90421b326efc375a5d35d443efea7138076af92',
    'fbeb38bf76fb0c2ecf0a7581bf035ad0e75d06ff',
    '1497556a4011ee748761119fa5ffc0760ce23291',
    '47b56ed7ca8fe0646c8021ef599e8c6168997202',
    'dd48eeccb99a5b735ab45631316e424a731ba824',
    'fe42beecd8b351a9f0878930915ac37ea65c3a13',
    '0c23d143844a35f8e6da0a2c480d4f57e10bf7ee',
    '178cbd0117ec78caac808304ef478a172c19e569',
  ];
  private static sampleBuildTimestampStartDate = new Date(2020, 9, 11);
  private static sampleBuildTimestampEndDate = new Date(2021, 1, 8);

  private static getRandomImageTag(): string {
    const baseVersion = this.sampleVersionNumbers[
      Math.floor(Math.random() * this.sampleVersionNumbers.length)
    ];
    const buildSuffix = this.sampleBuildSuffixes[
      Math.floor(Math.random() * this.sampleBuildSuffixes.length)
    ];
    return `${baseVersion}${buildSuffix}`;
  }

  private static getRandomBuildTimestamp(): string {
    return new Date(
      this.sampleBuildTimestampStartDate.getTime() +
        Math.random() *
          (this.sampleBuildTimestampEndDate.getTime() -
            this.sampleBuildTimestampStartDate.getTime()),
    )
      .toISOString()
      .replace(/.\d{3}Z$/, 'Z');
  }
  private static getRandomCommitLink(): string {
    const commitSha = this.sampleCommitSha[
      Math.floor(Math.random() * this.sampleCommitSha.length)
    ];
    return `https://github.com/mkdevops-se/konfigurator/commit/${commitSha}`;
  }

  constructor(private deploymentsService: DeploymentsService) {
    this.deploymentsService.getAll().then((deployments) => {
      const images = [];
      for (const deployment of deployments) {
        const mockBuildInfos = {
          IMAGE_TAG: MockBuildInfoService.getRandomImageTag(),
          BUILD_TIMESTAMP: MockBuildInfoService.getRandomBuildTimestamp(),
          COMMIT_LINK: MockBuildInfoService.getRandomCommitLink(),
        };
        images.push(`${deployment.name}-${mockBuildInfos.IMAGE_TAG}`);
        this.put(deployment.name, mockBuildInfos);
      }
      this.logger.log(
        `Generated ${images.length} mock build infos; ${JSON.stringify(
          images,
        )}`,
      );
    });
  }

  put(
    service: string,
    createMockBuildInfoDto: MockBuildInfoDto,
  ): MockBuildInfoDto {
    // this.logger.log(
    //   `Previously available: ${JSON.stringify(
    //     Object.keys(this.mockBuildInfos),
    //   )}, saving one more of "${service}" ...`,
    // );

    if (this.mockBuildInfos[service]) {
      this.mockBuildInfos[service].push(createMockBuildInfoDto);
    } else {
      this.mockBuildInfos[service] = [createMockBuildInfoDto];
    }

    return createMockBuildInfoDto;
  }

  get(service: string): MockBuildInfoDto {
    if (!this.mockBuildInfos[service] || !this.mockBuildInfos[service].length) {
      throw new NotFoundException(
        `Build info missing for ${service}, services available: ${JSON.stringify(
          Object.keys(this.mockBuildInfos),
        )}`,
      );
    } else {
      const mockBuildInfo = this.mockBuildInfos[service].shift();
      this.mockBuildInfos[service].push(mockBuildInfo);
      return mockBuildInfo;
    }
  }

  delete(service: string): MockBuildInfoDto {
    if (!this.mockBuildInfos[service] || !this.mockBuildInfos[service].length) {
      throw new NotFoundException(`Build info missing for ${service}`);
    } else {
      const deletedBuildInfo = this.mockBuildInfos[service].pop();
      if (!this.mockBuildInfos[service].length) {
        delete this.mockBuildInfos[service];
      }
      return deletedBuildInfo;
    }
  }
}
