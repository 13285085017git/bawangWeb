<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
  <title>js中的日期，计时器</title>
  <script type="text/javascript">
    function mytime(){
//获得当前时间
      var today=new Date();

//将当前时间转换为年月日的格式显示
//document.write(today.toLocaleString());

//得到年
      var year=today.getFullYear();

//得到月份，0-11
      var month=today.getMonth()+1;

//得到日
      var day=today.getDate();

//得到时
      var hh=today.getHours();

//得到分
      var mm=today.getMinutes();

//如果分钟小于10，就在前面加个0
      if(mm<10){
        mm="0"+mm;
      }

      var ss=today.getSeconds();
//如果秒数小于10，就在前面加个0
      if(ss<10){
        ss="0"+ss;
      }

//获取星期0-6
      var week=today.getDay();

//第一种方法
      var xq=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");

//第二种方法
      /*var xq;
      switch(week){
      case 0:
      xq="星期天";break;
      case 2:
      xq="星期一";break;
      .....
      }*/

      var msg=year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss+" "+xq[week];

      document.getElementById("time").value=msg;

//设置计时器
      setTimeout("mytime()","1000");
    }
  </script>
</head>


<body οnlοad="mytime()">
<form>
  <input type="text" style="border:0px;" id="time" size="100"/>
</form>
</body>
</html>
