import { TypeOrmConfigService } from '../core/service/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions =
  TypeOrmConfigService.dataSourceOptions();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
