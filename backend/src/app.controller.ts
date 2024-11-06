import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Temperature } from '@prisma/client';

@Controller('/api/v1/temperatures')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 全体温記録データ取得API
   * @returns 全体温記録データ
   */
  @Get()
  public async getTemperature(): Promise<Temperature[]> {
    return await this.appService.getAllTemperture();
  }

  /**
   * 体温データ作成API
   * @param temperature 作成する体温データ
   */
  @Post()
  @HttpCode(200)
  public async createTemperature(@Body() temperature: Temperature) {
    await this.appService.createTemperature(temperature);
  }

  /**
   * IDでの体温データ取得API
   * @param id 取得する体温データのID
   * @returns 指定したIDの体温データ
   */
  @Get(":id")
  public async getTemperatureById(@Param('id', ParseIntPipe) id: number): Promise<Temperature> {
    return await this.appService.getTempertureById(id);
  }

  /**
   * 体温データ更新API
   * @param id 更新する体温データのID
   * @param temperatureDetails 更新内容
   */
  @Put(":id")
  public async updateTemperature(@Param('id', ParseIntPipe) id: number, @Body() temperatureDetails: Temperature): Promise<void> {
    await this.appService.updateTemperture(id, temperatureDetails);
  }

  /**
   * 体温データ削除API
   * @param id 削除対象の体温データID
   */
  @Delete(":id")
  public async deleteTemperature(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.appService.deleteTemperature(id);
  }
}
