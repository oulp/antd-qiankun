import request from '@/utils/request';

export default async function(): Promise<any> { 
  return request('/api/apps');
}
