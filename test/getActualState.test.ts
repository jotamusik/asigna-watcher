import { getActualState, OrderState } from "../lib";

describe('GetActualState', () => {

  test('given an unknown order should return that the order state is unknown', () => {
    const webResponse = "<h2><strong>22020038146</strong> - <strong>1/937522</strong></h2>\n" +
      "<table class='table'>\n" +
      "<tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.unknown);
  });

  test('given an only registered expedition should return that the order state is sent', () => {
    const webResponse = "<h2><strong>22020038146</strong> - <strong>1/937522</strong></h2>\n" +
      "<table class='table'>\n" +
      "<tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "<tr class='1'><td><strong>EXPEDICIÓN REGISTRADA</strong></td><td>08/05/2020 - 02:30</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.sent);
  });

  test('given a received order by asigna should return that the order state is asignaReceived', () => {
    const webResponse = "<h2><strong>22020038146</strong> - <strong>1/937522</strong></h2>\n" +
      "<table class='table'>\n" +
      "<tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "<tr class='78'><td><strong>EXPEDICIÓN RECEPCIONADA DESTINO</strong></td><td>11/05/2020 - 17:05</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='1'><td><strong>EXPEDICIÓN REGISTRADA</strong></td><td>08/05/2020 - 02:30</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.asignaReceived);
  });

  test('given a conflicting zone order should return that the order state is noDelivery', () => {
    const webResponse = "<h2><strong>22020038146</strong> - <strong>1/937522</strong></h2>\n" +
      "<table class='table'>\n" +
      "<tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "<tr class='incidencia'><td><strong>ZONA CONFLICTIVA NO SALE A REPARTO      </strong></td><td>20/12/2019 - 08:39</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='incidencia'><td><strong>CONSOLIDADO: ZONA CONFLICTIVA NO SALE A REPARTO      </strong></td><td>20/12/2019 - 08:39</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>" +
      "<tr class='78'><td><strong>EXPEDICIÓN RECEPCIONADA DESTINO</strong></td><td>11/05/2020 - 17:05</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='1'><td><strong>EXPEDICIÓN REGISTRADA</strong></td><td>08/05/2020 - 02:30</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.noDelivery);
  });

  test('given a conflicting zone order that has been collected should return that the order state is received', () => {
    const webResponse = "<h2><strong>22019945049</strong> - <strong>1/903437</strong></h2>\n" +
      "<table class='table'><tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "<tr class='83'><td><strong>EXPEDICIÓN EN REPARTO</strong></td><td>20/12/2019 - 16:09</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='0'><td><strong>EXPEDICIÓN ENTREGADA</strong></td><td>20/12/2019 - 16:00</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='incidencia'><td><strong>ZONA CONFLICTIVA NO SALE A REPARTO      </strong></td><td>20/12/2019 - 08:39</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='incidencia'><td><strong>CONSOLIDADO: ZONA CONFLICTIVA NO SALE A REPARTO      </strong></td><td>20/12/2019 - 08:39</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='78'><td><strong>EXPEDICIÓN RECEPCIONADA DESTINO</strong></td><td>19/12/2019 - 21:18</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='1'><td><strong>EXPEDICIÓN REGISTRADA</strong></td><td>16/12/2019 - 09:45</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.received);
  });

  test('given an order that is on its way should return that the order state is onWay', () => {
    const webResponse = "<h2><strong>22020038146</strong> - <strong>1/937522</strong></h2>\n" +
      "<table class='table'>\n" +
      "<tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "<tr class='83'><td><strong>EXPEDICIÓN EN REPARTO</strong></td><td>12/05/2020 - 09:23</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='78'><td><strong>EXPEDICIÓN RECEPCIONADA DESTINO</strong></td><td>11/05/2020 - 17:05</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='1'><td><strong>EXPEDICIÓN REGISTRADA</strong></td><td>08/05/2020 - 02:30</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.onWay);
  });

  test('given an order that has been delivered should return that the order state is received', () => {
    const webResponse = "<h2><strong>22020038146</strong> - <strong>1/937522</strong></h2>\n" +
      "<table class='table'>\n" +
      "<tr><th>Descripción</th><th>Fecha de Estado</th><th>Bultos</th><th>Peso</th></tr>\n" +
      "<tr class='0'><td><strong>EXPEDICIÓN ENTREGADA</strong></td><td>12/05/2020 - 13:22</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='83'><td><strong>EXPEDICIÓN EN REPARTO</strong></td><td>12/05/2020 - 11:02</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='83'><td><strong>EXPEDICIÓN EN REPARTO</strong></td><td>12/05/2020 - 09:23</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='78'><td><strong>EXPEDICIÓN RECEPCIONADA DESTINO</strong></td><td>11/05/2020 - 17:05</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "<tr class='1'><td><strong>EXPEDICIÓN REGISTRADA</strong></td><td>08/05/2020 - 02:30</td><td style='padding-left:25px'>1</td><td>1 KG</td></tr>\n" +
      "</table>";
    expect(getActualState(webResponse)).toEqual(OrderState.received);
  });
});
