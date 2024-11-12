import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Temperature } from '@prisma/client';
import { prisma } from 'lib/prisma';

@Injectable()
export class AppService {

  /**
   * 全体温データ取得
   * @returns 全体温データ
   */
  public async getAllTemperture(): Promise<Temperature[]> {
    return await prisma.temperature.findMany({
      orderBy: {
        date: 'asc'
      }
    });;
  }

  /**
   * 体温データ新規作成
   * @param data 作成する体温データ
   */
  public async createTemperature(data: Temperature): Promise<void> {
    try {
      await prisma.temperature.create({
        data: {
          date: data.date,
          temperature: data.temperature
        }
      })
    } catch (e) {
      // データ不正時/それ以外の予期せぬエラーでハンドリング（一先ず400返却）
      if (e instanceof Prisma.PrismaClientValidationError) {
        console.log("データが不正です", e)
        throw new HttpException("データが不正です", HttpStatus.BAD_REQUEST);
      } else {
        console.log("予期せぬエラーが発生しました", e);
        throw new HttpException("予期せぬエラーが発生しました", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * IDでの体温データ取得
   * @param id 取得する体温データのID
   * @returns 指定IDの体温データ
   */
  public async getTempertureById(id: number): Promise<Temperature> {
    if(!await this.tempertureExistsById(id)) {
      console.log("指定のデータがありません")
      throw new HttpException("指定のデータがありません", HttpStatus.NOT_FOUND);  
    }

    return await prisma.temperature.findUnique({
      where: {
        id: id
      }
    })
  }
  
  /**
   * 体温データ更新
   * @param id 更新対象の体温データID
   * @param tempertureDetails 更新する内容のデータ
   */
  public async updateTemperture(id: number, tempertureDetails: Temperature): Promise<void> {
    try {
      await prisma.$transaction(async (prisma) => {
        // データ存在チェック（なければNotFound）
        if(!await this.tempertureExistsById(id)) {
          console.log("指定のデータがありません")
          throw new HttpException("指定のデータがありません", HttpStatus.NOT_FOUND);  
        }

        await prisma.temperature.update({
          where: {
            id: id
          },
          data: tempertureDetails
        })         
      })
    } catch (e) {
      // データ不正時/それ以外の予期せぬエラーでハンドリング（一先ず400返却）
      if (e instanceof Prisma.PrismaClientValidationError) {
        console.log("データが不正です", e)
        throw new HttpException("データが不正です", HttpStatus.BAD_REQUEST);
      } else {
        console.log("予期せぬエラーが発生しました", e);
        throw new HttpException("予期せぬエラーが発生しました", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * 体温データ削除
   * @param id 削除対象の体温データID
   */
  public async deleteTemperature(id: number): Promise<void> {
    try {
      await prisma.$transaction(async (prisma) => {
        // データ存在チェック（なければNotFound）
        if(!await this.tempertureExistsById(id)) {
          console.log("指定のデータがありません")
          throw new HttpException("指定のデータがありません", HttpStatus.NOT_FOUND);  
        }

        await prisma.temperature.delete({
          where: {
            id: id
          }
        })          
      })
    } catch (e) {
      // データ不正時/それ以外の予期せぬエラーでハンドリング（一先ず400返却）
      if (e instanceof Prisma.PrismaClientValidationError) {
        console.log("データが不正です", e)
        throw new HttpException("データが不正です", HttpStatus.BAD_REQUEST);
      } else {
        console.log("予期せぬエラーが発生しました", e);
        throw new HttpException("予期せぬエラーが発生しました", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * 指定したIDの体温データが存在するか？
   * @param id 判定する体温データのID
   * @returns 存在するか？（true：存在する、false：しない）
   */
  private async tempertureExistsById(id: number): Promise<boolean> {
    // データ存在チェック
    const temp = await prisma.temperature.findUnique({
      where: {
        id: id
      }
    })

    return temp != null;    
  }
}
