let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let path=require("path");

let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";

    if(!fs.existsSync(path.join(process.cwd(),"IPL2020")))
    fs.mkdirSync(path.join(process.cwd(),"IPL2020"));


request(url,cb);
function cb(err,response,html){
    
        let chselector=cheerio.load(html);
       
        let tables=chselector(".card.content-block.w-100.sidebar-widget .table.table-sm.sidebar-widget-table.text-center.mb-0");
        let allanc=chselector(tables).find("tbody tr a");
        for(let i=0;i<allanc.length;i++){
            let link="https://www.espncricinfo.com"+chselector(allanc[i]).attr("href");
            //console.log(link);
           request(link,cb1);
    }
    let fandres=chselector(".navbar.navbar-expand-lg.sub-navbar");
}
function cb1(err,response,html){
    let chselector=cheerio.load(html);
    let fixandres=chselector(".navbar.navbar-expand-lg.sub-navbar .navbar-nav .nav-item a")
    let url="https://www.espncricinfo.com/"+chselector(fixandres[1]).attr("href");
   // console.log(url);
    request(url,cb2);
    //console.log(res.length);
}
function cb2(err,response,html){
    let chselector=cheerio.load(html);
    let result=chselector(".widget-tabs.team-scores-tabs a");
    //console.log(result.length);
    let resurl="https://www.espncricinfo.com/"+chselector(result[1]).attr("href");
    let teamname=chselector(".header-title.label").text();
    console.log(teamname);
    let pathtofolder=path.join(process.cwd(),"IPL2020");
    if(!fs.existsSync(path.join(pathtofolder,teamname)))
        fs.mkdirSync(path.join(pathtofolder,teamname));

        request(resurl,function cb3(err,response,html){
        let chselector=cheerio.load(html);
        let allboxes=chselector(".match-info-link-FIXTURES");
       // console.log(allboxes.length);
        for(let i=0;i<allboxes.length;i++){
            let boxeslink="https://www.espncricinfo.com/"+chselector(allboxes[i]).attr("href");
            //console.log(boxeslink);
            request(boxeslink,function cb4(err,response,html){
                let chselector=cheerio.load(html);
                let desc=chselector(".match-header .description").text().split(",");
                let Bothteams=chselector(".match-header .teams .name-detail");
                // console.log(Bothteams.length);
                //console.log(twotables);
                let date=desc[2];
                let venue=desc[1];
                //console.log(venue);
                let opponent= (chselector(Bothteams[0]).text().trim()==teamname?chselector(Bothteams[1]).text().trim():chselector(Bothteams[0]).text().trim());
                console.log(opponent);
                let winnningTeam=chselector(".match-header .teams .team.team-gray .name-detail").text()==chselector(Bothteams[0]).text().trim()?chselector(Bothteams[1]).text().trim():chselector(Bothteams[0]).text().trim();
                console.log(winnningTeam);
                let twotables=chselector(".match-scorecard-page .card.content-block.match-scorecard-table");
               // console.log(twotables.length);
                for(let i=0;i<twotables.length-1;i++){
                 //   console.log("Hello");
                    let tName=chselector(twotables[i]).find(".header-title.label").text().split("INNINGS");
                   // console.log(tName[i]);
                    if(tName[0].trim()==teamname.trim()){
                        let batsmen=chselector(twotables[i]).find(".table.batsman tbody tr");
                        for(let j=0;j<batsmen.length;j++){
                            let allrows=chselector(batsmen[j]).find("td");
                            if(allrows.length==8){
                                //console.log(chselector(allrows).text());
                                let details=chselector(allrows);
                                
                                let obj={
                                    Name:chselector(details[0]).text().trim(),
                                    Runs:chselector(details[2]).text(),
                                    Balls:chselector(details[3]).text(),
                                    Fours:chselector(details[5]).text(),
                                    Sixes:chselector(details[6]).text(),
                                    SR:chselector(details[7]).text(),
                                    Date:date,
                                    opponent:opponent,
                                    venue:venue,
                                    Result:winnningTeam+"won.",
                                }
                                console.log(obj);
                                let fname=chselector(details[0]).text().trim();
                                let jsonfilepath=path.join(pathtofolder,teamname);
                                MakeJsonFile(fname,jsonfilepath,obj);

                            }
                        }

                    }
                    
                }
                

            });
           
        }
    });
}
// function MakeJsonFile(fname,path,obj){
//     let pt=path.join(path,fname+".json");
//     let arr;
//     if(!fs.existsSync(pt)){
//         fs.openSync(pt,"w");
//         arr=[];
//         arr.push(obj);
//     }else{
//         let content=fs.readFileSync(pt);
//         arr=JSON.parse(content);
//         arr.push(obj);
//     }
//     let contentinFile=JSON.stringify(arr);
//     fs.writeFileSync(pt,contentinFile);
// }
function MakeJsonFile(name,path1,obj)
{
    let pt=path.join(path1,name+".json");
    let arr;
    if(!fs.existsSync(pt))
       { 
           fs.openSync(pt,"w");
            arr=[];
            arr.push(obj);
       }
       else{
           content=fs.readFileSync(pt);
           arr=JSON.parse(content);
           arr.push(obj);
       }
    let contentinFile=JSON.stringify(arr);
    fs.writeFileSync(pt,contentinFile);
   // return pt;
}

